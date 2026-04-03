/**
 * ConfigManager - Singleton Pattern
 * Holds all exam configuration settings in one place.
 * Only one instance ever created - ensures consistency across app.
 */
class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }
    this.settings = {
      jeeMain: {
        correctMarks: 4,
        wrongMarks: -1,
        unattemptedMarks: 0,
        totalQuestions: 90,
        duration: 180, // minutes
      },
      jeeAdvanced: {
        correctMarks: 3,
        wrongMarks: -1,
        unattemptedMarks: 0,
        totalQuestions: 54,
        duration: 180,
      },
      quickBattle: {
        questions: 15,
        duration: 10, // minutes
      },
      privateRoom: {
        questions: 15,
        duration: 20,
      },
    };
    ConfigManager.instance = this;
  }

  get(key) {
    return this.settings[key];
  }

  getAll() {
    return this.settings;
  }
}

module.exports = new ConfigManager();
