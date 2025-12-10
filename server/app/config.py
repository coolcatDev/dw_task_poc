from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application configuration settings."""
    
    # --- Configuration Fields and Defaults ---
    DATABASE_URL: str = "sqlite:///./tasks.db"
    OPENAI_API_KEY: str = "" 

    # --- Configuration Rules (Pydantic Settings) ---
    model_config = SettingsConfigDict(
        # Check for and load variables found in the local file named ".env".
        env_file=".env",
        
        # If the environment has extra variables not listed above, ignore them.
        extra="ignore"
    )

# Create the final settings object.
# Priotity: Defaults < .env file < OS Environment Variables.
# This 'settings' object is used everywhere in the application to access env.
settings = Settings()