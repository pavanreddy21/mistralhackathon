import instructor

from pydantic import BaseModel
from mistralai.client import MistralClient
import json

class GPTModelManager:
    def __init__(self, system_message: str = "I'm an AI assistant here to help you with any questions you have."):
        """
        Initializes a new instance of the GPTModelManager.
        :param use_local: Determines whether to use a local model or an OpenAI model.
        """
        self.client = None
        self.chat = None
        self.initialize_client()
        self.system_message = system_message

    def initialize_client(self):
        """
        Initializes the GPT client based on the configuration.
        """
        self.client = MistralClient()
        self.chat = instructor.patch(create=self.client.chat, mode=instructor.Mode.MISTRAL_TOOLS)
    
    def get_response(self, prompt: str, response_model: BaseModel, model: str = 'mistral-large-latest') -> str:
        """
        Gets a response from the GPT model.
        :param prompt: The prompt to send to the GPT model.
        :return: The response from the GPT model.
        """
        response = self.chat(
            model=model,
            messages=[
                {"role": "system", "content": self.system_message},
                {"role": "user", "content": prompt},
            ],
            response_model=response_model
        )
        # extract string response from response object
        return response

