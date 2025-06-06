from textual.app import App, ComposeResult
from textual.containers import Container
from textual.widgets import Static, Header, Footer
from textual.reactive import reactive
from textual import events

import subprocess
import itertools

SPINNER = itertools.cycle(["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"])

def check_service(service_name: str) -> bool:
    """Check service status using systemctl (Linux only)."""
    result = subprocess.run(["systemctl", "is-active", service_name], capture_output=True, text=True)
    return result.stdout.strip() == "active"

class ServiceStatus(Static):
  status: reactive[str] = reactive("Unknown")

  def __init__(self, service_name: str):
    super().__init__()
    self.service_name = service_name
    self.label = service_name
    self.status = reactive("Checking")
    self.icon = reactive("⏳")

  def on_mount(self):
    self.set_interval(0.2, self.update_spinner)
    self.set_interval(2.0, self.update_status)

  def update_spinner(self):
    if self.status == "Online":
      self.icon = next(SPINNER)
    elif self.status == "Offline":
      self.icon = "❌"
    else:
      self.icon = "⏳"
    self.refresh()

  def render(self):
    if self.status == "Online":
      return f"[bold green]{self.icon} {self.label} is {self.status}[/bold green]"
    elif self.status == "Offline":
      return f"[bold red]{self.icon} {self.label} is {self.status}[/bold red]"
    else:
      return f"Checking on {self.label}"

  def update_status(self):
    self.status = "Online" if check_service(self.service_name) else "Offline"

class StatusApp(App):
  CSS_PATH = "dashboard.css"
  BINDINGS = [("q", "quit", "Quit")]

  def compose(self) -> ComposeResult:
    yield Header()
    yield Container(
      ServiceStatus("mongod"),
      ServiceStatus("ssh"),
      ServiceStatus("Is_Offline"), 
      #TODO add services here
    )
    yield Footer()

if __name__ == "__main__":
  StatusApp().run()
