import React from "react";
import {connect} from "react-redux";
import {setLectureFile, setLectureDate, clearUpload} from "../../Actions/lectureUploadActions.js";
import {setCourseFiles} from '../../Actions/courseFilesActions.js';
import { setStatusMessage, clearStatusMessage } from "../../Actions/instructorSettingsActions";

class LectureUpload extends React.Component {

    setFile(e){
        this.props.setLectureFile(e.target.files[0]);
    }

    setDate(e){
        this.props.setLectureDate(e.target.value);
    }

    submit(e){
        e.preventDefault();
        var formData = new FormData();
        formData.append('attachment', this.props.lectureUpload.lectureFile);
        formData.append('data', JSON.stringify({
            lectureDate: this.props.lectureUpload.lectureDate,
            courseId: this.props.courseId
        }));

        fetch('/api/lectureUpload', {method: "POST", body: formData, credentials: 'same-origin'}).then(response => {
            if(!response.ok){
                throw new Error(response.statusText);
            }
        }).then(() => {
                fetch(('/api/listofCourseLectures/'), {
                credentials: 'same-origin'
            }).then(res => res.json()).then(cour => {
                this.props.setCourseFiles(cour);
            }).then(() => {
                this.props.setStatusMessage('The new lecture was successfully uploaded.');
                document.getElementById("form").reset();
            });
        }).catch(e => {
            this.props.setStatusMessage('There was an error uploading the new lecture.');
        });
    }

    componentWillUnmount(){
        this.props.clearUpload();
        this.props.clearStatusMessage();
    }

    render(){
        console.log(this.props.status);
        return(
            <div className="container-fluid">
                <div className="col-md-3">
                </div>
                <div className="col-md-6">
                    <div>
                        <h1 style = {headerStyle}>Lecture Upload</h1>
                        <form onSubmit={this.submit.bind(this)} id="form">
                            <h4 style = {titleStyle}>Please select a file to upload</h4>
                            <p style = {noticeStyle}><b>NOTE:</b> Only .mp4 videos and .zip files are supported.</p>
                            <input style={inputStyle} type="file" accept="video/mp4,application/zip,application/octet-stream,application/x-zip,application/x-zip-compressed" name="lectureVideo" onChange={this.setFile.bind(this)} required/>
                            <br/>
                            <div style = {lectureDateStyle} >Lecture Date: <input type="date" name="lectureDate" onChange={this.setDate.bind(this)} required style={dateStyle}/></div>
                            <br/>
                            <input type="text" name="courseId" value={this.props.courseId} readOnly required style={hideInput}/>
                            <br/>
                            <input style = {submitStyle} type="submit" value="Submit" />
                        </form>
                    </div>
                    <div style = {statusStyle}>
                    {this.props.status}
                    </div>
                </div>
                <div className="col-md-3">
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {

    return {
        courseId: state.token.lis_course_section_sourcedid,
        roles: state.token.roles,
        lectureUpload: state.lectureUpload,
        status: state.instructorPage.status
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    
    return {
        setLectureFile: (file) => dispatch(setLectureFile(file)),
        setLectureDate: (date) => dispatch(setLectureDate(date)),
        clearUpload: () => dispatch(clearUpload()),
        setCourseFiles: (files) => dispatch(setCourseFiles(files)),
        setStatusMessage: (message) => dispatch(setStatusMessage(message)),
        clearStatusMessage: () => dispatch(clearStatusMessage())
    };
};


var hideInput = {
    visibility: "hidden"
}

var headerStyle= {
	fontWeight: "bold",
    fontSize: "36px",
    marginBottom: "40px"
}

var titleStyle = {
    fontSize: "24px",
    marginBottom: "20px"
}

var noticeStyle = {
    fontSize: "20px",
    marginBottom: "110px"
}

var inputStyle = {
    marginBottom: "25px",
    marginLeft: "25%",
    fontSize: "16px",
    outline: "none",
    position: "relative",
    boxShadow: "none"
}

var lectureDateStyle = {
    fontSize: "16px"
}

var submitStyle = {
    width: "50%",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "14px 20px",
    margin: "8px 0",
    border: "none",
    borderRadius: "4px"
}

var dateStyle = {
    boxShadow: "none"
}

var statusStyle = {
    fontSize: "20px",
    marginTop: "20px"
}

export default connect(mapStateToProps, mapDispatchToProps)(LectureUpload);