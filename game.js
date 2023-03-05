class Button {
    constructor(buttonID, element) {
        this.element = element;
        this.hue = buttonID.hue;
        this.setLightness(30);
    }

    setLightness(lightness) {
        const background = `hsl(${this.hue}, 75%, ${lightness}%)`;
        this.element.style.backgroundColor = background;
    }

    async press() {
        this.setLightness(65);
        await delay(100);
        this.setLightness(30);
    }
}

const buttonDescriptions = [{hue: 151}, {hue: 0}, {hue: 71}, {hue: 191}];
class Game {
    buttons;
    allowPlayer;
    sequence;
    playbackPosition;

    constructor() {
        this.buttons = new Map();
        this.allowPlayer = false;
        this.sequence = [];
        this.playbackPosition = 0;
        
        document.querySelectorAll('.game-button').forEach((element, i) => {
            if(i < buttonDescriptions.length) {
                this.buttons.set(element.id, new Button(buttonDescriptions[i], element));
                console.log(buttonDescriptions[i]);
            }
        });

        const playerName = document.getElementById("mystery-player");
        playerName.innerHTML = this.getPlayerName();
    }

    async pressButton(button) {
        if(this.allowPlayer) {
            console.log(`button ${button.id} pressed`);
            this.allowPlayer = false;
            await this.buttons.get(button.id).press();

            if(this.sequence[this.playbackPosition].element.id === button.id) {
                this.playbackPosition++;
                if(this.playbackPosition === this.sequence.length) {
                    this.playbackPosition = 0;
                    this.addButton();
                    this.updateScore(this.sequence.length - 1);
                    await this.playSequence();
                }
                this.allowPlayer = true;
            } else {
                this.saveScore(this.sequence.length - 1);
                await this.buttonDance(2);
            }
        }
    }

    async reset() {
        console.log('reset')
        this.allowPlayer = false;
        this.playbackPosition = 0;
        this.sequence = [];
        this.updateScore('--');
        await this.buttonDance(1);
        this.addButton();
        await this.playSequence();
        this.allowPlayer = true;
    }

    async playSequence() {
        await delay(500);
        for (const btn of this.sequence) {
            await btn.press();
            await delay(400);
        }
    }

    addButton() {
        const btn = this.getRandomButton();
        this.sequence.push(btn);
    }

    updateScore(score) {
        const scoreElement = document.getElementById("score");
        scoreElement.innerHTML = score;
    }

    async buttonDance(laps = 1) {
        for(let step = 0; step < laps; step++) {
            for(const btn of this.buttons.values()) {
                await btn.press();
                await delay(400);
            }
        }
    }

    getRandomButton() {
        let buttons = Array.from(this.buttons.values());
        return buttons[Math.floor(Math.random() * this.buttons.size)];
    }

    saveScore(score) {
        const username = this.getPlayerName();
        let scores = [];
        const scoresText = localStorage.getItem('scores');
        if(scoresText) {
            scores = JSON.parse(scoresText);
        }
        scores = this.updateScores(username, score, scores);

        localStorage.setItem("scores", JSON.stringify(scores));
    }

    getPlayerName() {
        return localStorage.getItem('username') ?? 'Mystery player';
    }

    updateScores(username, score, scores) {
        const date = new Date().toLocaleDateString();
        const newScore = {name: username, score: score, date: date};
        let found = false;
        for (const [i, prevScore] of scores.entries()) {
            if (score > prevScore.score) {
              scores.splice(i, 0, newScore);
              found = true;
              break;
            }
          }
      
          if (!found) {
            scores.push(newScore);
          }
      
          if (scores.length > 10) {
            scores.length = 10;
          }
      
          return scores;
    }
}

const game = new Game();

function delay(pauseTime) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('success');
        }, pauseTime);
    })
}