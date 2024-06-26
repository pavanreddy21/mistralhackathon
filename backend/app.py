from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import os
import json

from models.analysis import AnalysisResponse
from utils.gpt import GPTModelManager
from models.explanation_cards import ExplanationCards


app = Flask(__name__)
api = Api(app)

class AnalyzePerfScript(Resource):
    def post(self):
        # Check if the file is present in the request
        if 'perf_script' not in request.files:
            return jsonify({"error": "No file part"})

        file = request.files['perf_script']

        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return jsonify({"error": "No selected file"})

        if file:
            # Save the file to a secure location or perform analysis directly
            # For demonstration, let's assume we're analyzing the file directly
            analysis_result = self.analyze_file(file)
            return jsonify({"message": "File successfully analyzed", "analysis": analysis_result})

    def analyze_file(self, file):
        # Placeholder for file analysis logic
        # You can add your analysis code here
        # For demonstration, let's return a simple message
        system_message = "You are an expert senior systems engineer, great at reading and analyzing flamegraphs and kernel system calls. \
        You are trying to help a user understand the flamegraphs and kernel system calls. \
        Help them walkthrough call stacks and hidden bottlenecks in the flamegraphs. \
        deep_stacks and other are intentionally flattened to focus on significant call stacks. \
        Make sure to include clean optimizations to solve bottlenecks at conclusion on explanation cards."
        
        perf_script_content = file.read().decode('utf-8')

        gpt = GPTModelManager(system_message=system_message)
        model = 'mistral-large-latest'
        analysis_response = gpt.get_response("Find the most expensive, hidden bottleneck functions in the flame graph", AnalysisResponse, model)
        top_consumers = analysis_response.construct_flame_graph(perf_script_content)
        # print(top_consumers)
        # top_consumers_str = ', '.join(top_consumers)
        
        cards = gpt.get_response(f"flamegraph_summary: {top_consumers} \n---\n Generate explanation cards for the flame graph", ExplanationCards, model)

        # save json data to file
        # with open('flamegraph.json', 'w') as f:
        #     json.dump(analysis_response.flame_graph, f)

        return {"message": "File successfully analyzed", "explanation_cards": [card.dict() for card in cards.explanation_cards], "flame_graph": json.dumps(analysis_response.flame_graph), "summary": top_consumers}
        

api.add_resource(AnalyzePerfScript, '/analyze')

if __name__ == '__main__':
    app.run(debug=True)