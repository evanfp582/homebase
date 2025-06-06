# service_dashboard.py
from textual.app import App, ComposeResult
from textual.containers import Container
from textual.widgets import Static
from textual.reactive import reactive
from textual import events

import subprocess

def check_service(service_name: str) -> bool:
    """Check service status using systemctl (Linux only)."""
    result = subprocess.run(["systemctl", "is-active", service_name], capture_output=True, text=True)
    return result.stdout.strip() == "active"

class ServiceStatus(Static):
    status: reactive[str] = reactive("Unknown")

    def __init__(self, service_name: str):
        super().__init__()
        self.service_name = service_name

    def on_mount(self):
        self.set_interval(2.0, self.update_status)

    def render(self) -> str:
        if self.status == "Online":
            return f"[green]🟢 {self.service_name}: {self.status}[/green]"
        elif self.status == "Offline":
            return f"[red]🔴 {self.service_name}: {self.status}[/red]"
        else:
            return f"[yellow]🟡 {self.service_name}: Checking...[/yellow]"

    def update_status(self):
        self.status = "Online" if check_service(self.service_name) else "Offline"

class StatusApp(App):
    CSS_PATH = None  # You can add a CSS file here if you want

    def compose(self) -> ComposeResult:
        yield Container(
            ServiceStatus("mongod"),
            ServiceStatus("ssh"),
            ServiceStatus("nginx"),  # add your services here
        )

if __name__ == "__main__":
    StatusApp().run()
