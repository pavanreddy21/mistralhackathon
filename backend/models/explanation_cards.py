from pydantic import BaseModel, Field
from typing import List

class ExplanationCard(BaseModel):
    title: str = Field(..., title="Title of the explanation card", examples=['Analysis Part 1'])
    content: str = Field(..., title="Content of the explanation card in Markdown", examples=['- This is the first point \n- This is the second point'])

class ExplanationCards(BaseModel):
    explanation_cards: List[ExplanationCard] = Field(..., title="List of explanation cards")

