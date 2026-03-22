from .api import agents, threads
from .agent import bapXAgent
from .thread import bapXThread
from .tools import AgentPressTools, MCPTools


class bapX:
    def __init__(self, api_key: str, api_url="https://api.kortix.com/v1"):
        self._agents_client = agents.create_agents_client(api_url, api_key)
        self._threads_client = threads.create_threads_client(api_url, api_key)

        self.Agent = bapXAgent(self._agents_client)
        self.Thread = bapXThread(self._threads_client)
