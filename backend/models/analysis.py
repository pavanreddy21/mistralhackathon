from pydantic import BaseModel, Field
from typing import List
import subprocess
import os
from utils.utils import create_hierarchical_json, extract_in_depth_top_consumers, format_detailed_summary

class AnalysisResponse(BaseModel):
    message: str = Field(default="Working to update flame graph and explanation cards", title="Message from the assistant pre-analysis", examples=['Working to update flame graph and explanation cards'])
    flame_graph: dict = None

    def construct_flame_graph(self, perf_script):    

        # Assuming perf_script is a file path for simplicity
        # Use stackcollapse.pl to collapse the call stacks
        with open('source.script', 'w') as source_file:
            source_file.write(perf_script)
        
        script_path = os.path.join(os.path.dirname(__file__), '..', 'utils', 'stackcollapse-perf.pl')
        with open('collapsed.txt', 'w') as collapsed_file:
            subprocess.run(["perl", script_path, 'source.script'], stdout=collapsed_file)
        os.remove('source.script')
        with open('collapsed.txt', 'r') as collapsed_file:
            collapsed_output = collapsed_file.read()
        os.remove('collapsed.txt')
        # Convert bytes output to string and split into lines for processing
        collapsed_lines = collapsed_output.splitlines()

        # Use create_hierarchical_json to create the flame graph data structure
        flame_graph_data = create_hierarchical_json(collapsed_lines)

        # Convert the flame graph data structure to JSON
        self.flame_graph = flame_graph_data
        in_depth_top_consumers = extract_in_depth_top_consumers(self.flame_graph)
        
        return format_detailed_summary([in_depth_top_consumers])


