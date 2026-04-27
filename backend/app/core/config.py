from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ANTHROPIC_API_KEY: str
    DATABASE_URL: str
    
    #  this line to handle the 'debug' variable from your .env
    DEBUG: bool = False 

    # Modern Pydantic V2 way to handle config
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore" # This prevents future crashes if you add more variables to .env
    )

settings = Settings()