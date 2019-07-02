import React, { Component } from "react";

class Timer extends Component {
  constructor(props) {
    super(props);

    this.multiplier = 1000; //Change to 10 to debug
    this.warmingUpTime = 300 * this.multiplier;
    this.coolingDownTime = 300 * this.multiplier;

    this.interval = null;
    this.walkAudio = null;
    this.runAudio = null;
    this.finishAudio = null;

    this.state = {
      runningTime: 60 * this.multiplier,
      walkingTime: 180 * this.multiplier,
      series: 5,
      currentSeries: 1,
      seconds: 0,
      timer: "",
      message: ""
    };
  }

  showSplits = event => {
    const splits = event.target.value.split(",");
    this.setState({
      runningTime: Number(splits[0]) * this.multiplier,
      walkingTime: Number(splits[1]) * this.multiplier,
      series: Number(splits[2])
    });
  };

  start = event => {
    event.preventDefault();

    console.log("start");

    this.setState({
      message: ` Warm up! Walk ${this.warmingUpTime /
        this.multiplier /
        60} minutes`
    });

    this.walkAudio.play();

    setTimeout(this.nextSeries, this.warmingUpTime);

    this.interval = setInterval(this.updateTimer, this.multiplier);
  };

  nextSeries = () => {
    const { series, runningTime, walkingTime, currentSeries } = this.state;

    if (currentSeries <= series) {
      this.setState({
        message: `Series ${currentSeries}. Run ${runningTime /
          this.multiplier /
          60} minutes`
      });
      this.runAudio.play();

      setTimeout(() => {
        this.setState({
          message: `Series ${currentSeries}. Walk ${walkingTime /
            this.multiplier /
            60} minutes`
        });
        this.walkAudio.play();

        setTimeout(this.nextSeries, walkingTime);
      }, runningTime);
      this.setState(prevState => {
        return {
          currentSeries: prevState.currentSeries + 1
        };
      });
    } else {
      this.setState({
        message: `Cool down! Walk ${this.coolingDownTime /
          this.multiplier /
          60} minutes`
      });
      setTimeout(() => {
        this.setState({
          message: "Finish!"
        });
        clearInterval(this.interval);
        this.endAudio.play();
      }, this.coolingDownTime);
    }
  };

  updateTimer = () => {
    this.setState(prevState => {
      const currentSeconds = prevState.seconds + 1;
      const minutes = (currentSeconds / 60).toString().split(".")[0];
      return {
        seconds: currentSeconds,
        timer: `${minutes}'${currentSeconds - minutes * 60}"`
      };
    });
  };

  render() {
    const { series, runningTime, walkingTime, message, timer } = this.state;
    return (
      <div className="App">
        <form onSubmit={this.start}>
          <select name="week" onChange={this.showSplits}>
            <option value="60,180,5">Week 1</option>
            <option value="90,180,5">Week 2</option>
            <option value="120,120,5">Week 3</option>
            <option value="180,120,5">Week 4</option>
            <option value="300,120,3">Week 5</option>
            <option value="480,120,3">Week 6</option>
            <option value="600,60,3">Week 7</option>
            <option value="900,60,2">Week 8</option>
          </select>
          <input type="submit" value="start" />
        </form>

        <p id="splits">{`${series} series of ${runningTime /
          this.multiplier /
          60}' running and ${walkingTime / this.multiplier / 60}' walking`}</p>
        <hr />
        <p>{message}</p>
        <p>{timer}</p>

        <audio id="walk!" ref={(elem) => this.walkAudio = elem}>
          <source src="audios/walk.mp3" type="audio/mpeg" />
        </audio>
        <audio id="run!" ref={(elem) => this.runAudio = elem}>
          <source src="audios/run.mp3" type="audio/mpeg" />
        </audio>
        <audio id="finish!" ref={(elem) => this.finishAudio = elem}>
          <source src="audios/end.wav" type="audio/mpeg" />
        </audio>
      </div>
    );
  }
}

export default Timer;
