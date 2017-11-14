import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {connect} from "react-redux";
import {setCalSDate,
  setCalEDate,
  setCalSTime,
  setCalETime,
  setCalRecurDays,
  setCalExcludeDates,
  setCalIncludeDates,
  setCalCurExDates,
  setCalCurIncDates,
  setCalDescription,
  setCalLoc,
  setCalCourseId,
  clearForm
  } from '../../Actions/action.js';

class CalendarForm extends React.Component {

  constructor(props){
    super(props);
    this.formatDate = this.formatDate.bind(this);
    this.revertDate = this.revertDate.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.state = {
      sDate: moment().format("YYYYMMDD").toString(),
      eDate: moment().add(1, 'M').format("YYYYMMDD").toString(),
      sTime: "",
      eTime: "",
      recurDays: [],
      excludeDates: [],
      includeDates: [],
      description: "",
      location: "",
      courseId: this.props.courseId
    };
  }

  componentWillMount(){
    this.props.setCourseId(this.props.courseId);
  }

  componentWillUnmount(){
    this.props.clearForm();
  }

  isValidated(value, name) {
    if(name === 'sDate' || name === 'eDate'){
      return (value.length === 8);
    }
    else if(name === 'sTime' || name === 'eTime'){
      return (value.length === 6);
    }
    else if(name === 'recurDays' || name === 'description' || name === 'location'){
      return (value.length > 0);
    }
    else{
      return false;
    }
  }

  canBeSubmitted() {
    return (
      (this.isValidated(this.state.sDate, 'sDate')) &&
      (this.isValidated(this.state.eDate, 'eDate')) &&
      (this.isValidated(this.state.sTime, 'sTime')) &&
      (this.isValidated(this.state.eTime, 'eTime')) &&
      (this.isValidated(this.state.recurDays, 'recurDays')) &&
      (this.isValidated(this.state.description, 'description')) &&
      (this.isValidated(this.state.location, 'location'))
    );
  }

  handleSubmit(e){
    if(!this.canBeSubmitted()){
      e.preventDefault();
      return;
    }
    else{
      e.preventDefault();

      var options = {method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                      sDate: this.state.sDate,
                      eDate: this.state.eDate,
                      sTime: this.state.sTime,
                      eTime: this.state.eTime,
                      recurDays: this.state.recurDays,
                      excludeDates: this.state.excludeDates,
                      includeDates: this.state.includeDates,
                      description: this.state.description,
                      location: this.state.location,
                      courseId: this.state.courseId
                    })};

      fetch('/calendar', options).then((response) => {
        return response.text()
      }).then((data) => console.log(data)).catch((err) => console.log(err));
    }
  }

  handleChange(name, e) {
    var change = {};
    if(name === 'sDate' || name === 'eDate'){
      change[name] = e.format("YYYYMMDD").toString();
    }
    else if(name === 'sTime' || name === 'eTime'){
      change[name] = this.formatTime(e.target.value);
    }
    else{
      change[name] = e.target.value
    }
    this.setState(change);
  }

  handleCheckboxChange(e){
    const rDays = this.state.recurDays;
    let index

    if(e.target.checked) {
      rDays.push(e.target.name);
    }
    else {
      index = rDays.indexOf(e.target.name);
      rDays.splice(index, 1);
    }

    this.setState({recurDays: rDays});
    this.props.setCalRecurDays({recurDays: rDays});
  }

  handleAddDate(name, e){
    if(e.format("YYYYMMDD").toString() !== moment().format("YYYYMMDD").toString()){
      if(name === 'exclude'){
        const currentExcludes = this.state.excludeDates;
        const newExcludes = currentExcludes.concat(this.formatDate(e.format("YYYY-MM-DD").toString()));
        this.setState({excludeDates: newExcludes});
        this.props.setCalExcludeDates({excludeDates: newExcludes});
      }
      else if(name === 'include'){
        const currentIncludes = this.state.includeDates;
        const newIncludes = currentIncludes.concat(this.formatDate(e.format("YYYY-MM-DD").toString()));
        this.setState({includeDates: newIncludes});
        this.props.setCalIncludeDates({includeDates: newIncludes});
      }
    }
  }

  formatDate(date) {
    var split = date.split("-");
    return split[0] + split[1] + split[2];
  }

  revertDate(date) { //20171014
    var yyyy = date.substring(0, 4);
    var mm = date.substring(4, 6);
    var dd = date.substring(6, 8);

    return mm + "/" + dd + "/" + yyyy;
  }

  formatTime(time) { //Formats time from form format to ics format
    var str = time.split(":");
    return str[0] + str[1] + "00";
  }

  render() {

    console.log("Cal State", this.props.calendarForm);

    const isEnabled = this.canBeSubmitted();

    return (
      <div className='calForm'>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>New Recording Schedule: {this.props.courseId}</legend>
            <div>
              <label style={labelStyle} htmlFor='sDate'>Start Date: </label>
              <DatePicker customInput={<button style={buttonStyle}>{moment(this.state.sDate).format("MM/DD/YYYY").toString()}</button>} openToDate={moment(this.state.sDate)} onChange={this.handleChange.bind(this, 'sDate')}/>
            </div>
            <div>
              <label style={labelStyle} htmlFor='sTime'>Start Time: </label>
              <input style={inputStyle} type='time' placeholder='Start Time: hh:mm AM/PM' name='sTime' onChange={this.handleChange.bind(this, 'sTime')}/>
              <label style={labelStyle} htmlFor='eTime'>End Time: </label>
              <input style={inputStyle} type='time' placeholder='End Time: hh:mm AM/PM' name='eTime' onChange={this.handleChange.bind(this, 'eTime')}/>
            </div>
            <div>
              <label style={labelStyle} htmlFor='eDate'>End Date: </label>
              <DatePicker customInput={<button style={buttonStyle}>{moment(this.state.eDate).format("MM/DD/YYYY").toString()}</button>} openToDate={moment(this.state.eDate)} onChange={this.handleChange.bind(this, 'eDate')}/>
            </div>
            <div>
              <label style={labelStyle}>Repeat (WEEKLY): </label>
              <label style={labelStyle} htmlFor='Monday'><input style={chkbxStyle} type='checkbox' name='Monday' onChange={this.handleCheckboxChange.bind(this)}/>Monday</label>
              <label style={labelStyle} htmlFor='Tuesday'><input style={chkbxStyle} type='checkbox' name='Tuesday' onChange={this.handleCheckboxChange.bind(this)}/>Tuesday</label>
              <label style={labelStyle} htmlFor='Wednesday'><input style={chkbxStyle} type='checkbox' name='Wednesday' onChange={this.handleCheckboxChange.bind(this)}/>Wednesday</label>
              <label style={labelStyle} htmlFor='Thursday'><input style={chkbxStyle} type='checkbox' name='Thursday' onChange={this.handleCheckboxChange.bind(this)}/>Thursday</label>
              <label style={labelStyle} htmlFor='Friday'><input style={chkbxStyle} type='checkbox' name='Friday' onChange={this.handleCheckboxChange.bind(this)}/>Friday</label>
            </div>
            <div>
              <DatePicker customInput={<button style={buttonStyle}>Exclude A Date</button>} openToDate={moment()} onChange={this.handleAddDate.bind(this, 'exclude')}/>
              <label name='excludeDates'>Currently Excluded: [{this.state.excludeDates.map((date, i) => {
                var newDate = "";
                if(i === 0){
                  newDate = this.revertDate(date);
                }
                else{
                  newDate = ", " + this.revertDate(date);
                }
                return (<p key={i} style={dateStyle}>{newDate}</p>)})}]
              </label>
            </div>
            <div>
              <DatePicker customInput={<button style={buttonStyle}>Include Extra Date</button>} openToDate={moment()} value='Pick a date to include' onChange={this.handleAddDate.bind(this, 'include')}/>
              <label name='includeDates'>Currently Added: [{this.state.includeDates.map((date, i) => {
                var newDate = "";
                if(i === 0){
                  newDate = this.revertDate(date);
                }
                else{
                  newDate = ", " + this.revertDate(date);
                }
                return (<p key={i} style={dateStyle}>{newDate}</p>)})}]
              </label>
            </div>
            <div>
              <label htmlFor='description'>Description: </label>
              <input style={inputStyle} type='text' placeholder='Class description...' name='description' onChange={this.handleChange.bind(this, 'description')}/>
              <label htmlFor='location'>Location: </label>
              <input style={inputStyle} type='text' placeholder='Class location...' name='location' onChange={this.handleChange.bind(this, 'location')}/>
            </div>
            <div>
              <input type='submit' style={buttonStyle} disabled={!isEnabled} value='Create Schedule'/>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
	
	return {
    calendarForm: state.calendarForm,
		courseId: state.token.lis_course_section_sourcedid
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	
	return {
    clearForm: () => dispatch(clearForm()),
    setCourseId: id => dispatch(setCalCourseId(id)),
    setCalRecurDays: (days) => dispatch(setCalRecurDays(days)),
    setCalExcludeDates: (dates) => dispatch(setCalExcludeDates(dates)),
    setCalIncludeDates: (dates) => dispatch(setCalIncludeDates(dates))
	}
};

var buttonStyle = {
    backgroundColor: "white",
    borderRadius: "4px",
    marginTop: "5px",
    marginBottom: "5px",
    color: "#000080",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "4px",
    paddingBottom: "4px",
}

var dateStyle = {
  display: "inline-block"
}

var inputStyle = {
  margin: "10px 5px 10px",
  boxSizing: "border-box"
}

var chkbxStyle = {
  marginRight: "2px"
}

var labelStyle = {
  fontWeight: "bold",
  marginRight: "5px",
}

var fieldsetStyle = {
  border: "1px solid black",
  width: "50%",
  background: "white",
  padding: "3px",
  margin: "auto"
}

var legendStyle = {
  background: "#000080",
  padding: "6px",
  fontWeight: "bold",
  color: "white"
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarForm);
