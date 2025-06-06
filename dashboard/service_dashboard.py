from textual.app import App, ComposeResult
from textual.widgets import Static, Header, Footer
from textual.reactive import reactive
import subprocess
import itertools

SPINNER = itertools.cycle(["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"])

def check_service(service_name: str) -> bool:
  """Checks the specific service
  Args:
    service_name (str): name of service
  Returns:
    bool: True if service is active
  Note:
    Does not work on windows
  """
  result = subprocess.run(["systemctl", "is-active", service_name], capture_output=True, text=True)
  return result.stdout.strip() == "active"

class ServiceStatus(Static):
  def __init__(self, label: str, service: str):
    super().__init__()
    self.label = label
    self.service = service
    self.status = reactive("Checking")
    self.icon = reactive("⏳")

    def on_mount(self):
      self.set_interval(0.2, self.update_spinner)
      self.set_interval(2.0, self.check_status)

    def update_spinner(self):
      if self.status == "Online":
        self.icon = next(SPINNER)
      elif self.status == "Offline":
        self.icon = "❌"
      else:
        self.icon = "⏳"
      self.refresh()

    def check_status(self):
      if check_service(self.service):
        self.status = "Online"
      else:
        self.status = "Offline"

    def render(self):
      if self.status == "Online":
        return f"[bold green]{self.icon} {self.label} is {self.status}[/bold green]"
      elif self.status == "Offline":
        return f"[bold red]{self.icon} {self.label} is {self.status}[/bold red]"
      else:
        return f"{self.icon} {self.label}: {self.status}"


class StatusApp(App):
  BINDINGS = [("q", "quit", "Quit")]

  def compose(self) -> ComposeResult:
    yield Header()
    yield ServiceStatus("MongoDB", "mongod")
    yield ServiceStatus("SSH Server", "ssh")
    yield ServiceStatus("Cron", "cron")
    yield Footer()


if __name__ == "__main__":
    StatusApp().run()
