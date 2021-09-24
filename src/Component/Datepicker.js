import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { getMonthMetrics, dateToInput, getMonthString } from "./utils";

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp =
  Date.now() -
  (Date.now() % oneDay) +
  new Date().getTimezoneOffset() * 1000 * 60;
let inputRef = React.createRef();

export default class CustomDatePicker extends Component {
  state = {
    getMonthDetails: [],
  };

  constructor() {
    super();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    this.state = {
      year,
      month,
      selectedDay: todayTimestamp,
      monthDetails: getMonthMetrics(year, month),
      showDatePicker: false,
    };
  }

  componentDidMount() {
    window.addEventListener("click", this.addBackDrop);
    dateToInput(this.state.selectedDay, inputRef);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.addBackDrop);
  }

  setDate = (dateData) => {
    let selectedDay = new Date(
      dateData.year,
      dateData.month - 1,
      dateData.date
    ).getTime();
    this.setState({ selectedDay });
    if (this.props.onChange) {
      this.props.onChange(selectedDay);
    }
  };

  setYear = (offset) => {
    let year = this.state.year + offset;
    let month = this.state.month;
    this.setState({
      year,
      monthMetrics: getMonthMetrics(year, month),
    });
  };

  setMonth = (offset) => {
    let year = this.state.year;
    let month = this.state.month + offset;
    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }
    this.setState({
      year,
      month,
      monthMetrics: getMonthMetrics(year, month),
    });
  };
  addBackDrop = (e) => {
    if (
      this.state.showDatePicker &&
      !ReactDOM.findDOMNode(this).contains(e.target)
    ) {
      this.showDatePicker(false);
    }
  };
  updateDateFromInput = (inputRef) => {
    let dateValue = inputRef.current.value;
    let dateData = this.getDateFromDateString(dateValue);
    if (dateData !== null) {
      this.setDate(dateData);
      this.setState({
        year: dateData.year,
        month: dateData.month - 1,
        monthMetrics: getMonthMetrics(dateData.year, dateData.month - 1),
      });
    }
  };

  onDateClick = (day) => {
    this.setState({ selectedDay: day.timestamp }, () =>
      dateToInput(day.timestamp, inputRef)
    );
    if (this.props.onChange) {
      this.props.onChange(day.timestamp);
    }
  };
  showDatePicker = (value) => {
    this.setState({ showDatePicker: value });
  };

  isCurrentDay = (day, todayTimestamp) => {
    return day.timestamp === todayTimestamp;
  };

  isSelectedDay = (day) => {
    return day.timestamp === this.state.selectedDay;
  };
  /**
   *  Renderers
   */

  renderCalendar() {
    let days = this.state.monthDetails.map((day, index) => {
      return (
        <div
          className={
            "c-day-container " +
            (day.month !== 0 ? " disabled" : "") +
            (this.isCurrentDay(day) ? " highlight" : "") +
            (this.isSelectedDay(day) ? " highlight-green" : "")
          }
          key={index}
        >
          <div className="cdc-day">
            <span onClick={() => this.onDateClick(day)}>{day.date}</span>
          </div>
        </div>
      );
    });

    return (
      <div className="c-container">
        <div className="cc-head">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
            <div key={i} className="cch-name">
              {d}
            </div>
          ))}
        </div>
        <div className="cc-body">{days}</div>
      </div>
    );
  }

  render() {
    return (
      <div
        className="sendbox-datepicker"
        onMouseLeave={() => this.showDatePicker(false)}
        onMouseEnter={() => this.showDatePicker(true)}
      >
        <div className="sendbox-input">
          <input
            type="date"
            onChange={this.updateDateFromInput}
            ref={inputRef}
          />
        </div>
        {this.state.showDatePicker ? (
          <div className="sendbox-container">
            <div className="sendbox-h-element">
              <div className="sendbox-ch-button">
                <div
                  className="sendbox-chb-inner"
                  onClick={() => this.setYear(-1)}
                >
                  <span className="sendbox-chbi-left-arrows"></span>
                </div>
              </div>
              <div className="sendbox-ch-button">
                <div
                  className="sendbox-chb-inner"
                  onClick={() => this.setMonth(-1)}
                >
                  <span className="sendbox-chbi-left-arrow"></span>
                </div>
              </div>
              <div className="sendbox-ch-container">
                <div className="sendbox-chc-year">{this.state.year}</div>
                <div className="sendbox-chc-month">
                  {getMonthString(this.state.month)}
                </div>
              </div>
              <div className="sendbox-ch-button">
                <div
                  className="sendbox-chb-inner"
                  onClick={() => this.setMonth(1)}
                >
                  <span className="sendbox-chbi-right-arrow"></span>
                </div>
              </div>
              <div
                className="sendbox-ch-button"
                onClick={() => this.setYear(1)}
              >
                <div className="sendbox-chb-inner">
                  <span className="sendbox-chbi-right-arrows"></span>
                </div>
              </div>
            </div>
            <div className="sendbox-b-element">{this.renderCalendar()}</div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
