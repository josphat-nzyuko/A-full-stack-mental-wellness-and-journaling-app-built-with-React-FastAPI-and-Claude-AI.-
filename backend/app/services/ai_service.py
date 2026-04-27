from app.core.config import settings
import anthropic  # type: ignore

async def generate_insight(journal_content: str) -> str:
    # Return placeholder if no API key is loaded yet
    if not settings.ANTHROPIC_API_KEY or settings.ANTHROPIC_API_KEY == "your-anthropic-api-key":
        return "AI insight will appear here once your Anthropic API credits are loaded."

    try:
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": f"""You are a compassionate mental wellness coach. 
                    A user has written the following journal entry. 
                    Please provide a brief, supportive, and insightful reflection 
                    in 3 to 4 sentences. Focus on emotional patterns, strengths 
                    you notice, and one gentle suggestion.

                    Journal entry:
                    {journal_content}"""
                }
            ]
        )
        return message.content[0].text

    except Exception as e:
        return f"Insight temporarily unavailable: {str(e)}"