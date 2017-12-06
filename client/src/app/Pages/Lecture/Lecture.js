import React from "react";
import {connect} from "react-redux";
import {setLectureManifest} from '../../Actions/lectureManifestActions.js';
import LectureMedia from "../../components/LectureMedia/LectureMedia";
import {convertMonth} from '../../utils/utils.js';

class Lecture extends React.Component {

	componentDidMount(){
		fetch(('/api/manifest/' + this.props.params.lectureId), {
			credentials: 'same-origin' // or 'include'
		  }).then(
			res => (res.status === 200 ) ? res.json() : {}
		).then(
			json => {
				this.props.setManifest(json);
			}
		)
	}

	componentWillUnmount(){
		this.props.setManifest({});
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="col-md-2">
				</div>
				
				<div className="col-md-8">
					<div>
						<h2 style={headerStyle}>
							{"Lecture: " + convertMonth(this.props.params.lectureId.substring(0,10)) + this.props.params.lectureId.substring(3,5) + ", " + this.props.params.lectureId.substring(6,10)}
						</h2>
					</div>
					<div>
						<LectureMedia
							manifest = {this.props.manifest}
							lectureId = {this.props.params.lectureId}
							courseId = {this.props.params.courseId}
						/>
					</div>
				</div>

				<div className="col-md-2">
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	
	return {
		manifest: state.lectureManifest
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	
	return {
		setManifest: json => dispatch(setLectureManifest(json))
	}
};


var headerStyle = {
	fontWeight: "bold",
	fontSize: "36px"
}

export default connect(mapStateToProps, mapDispatchToProps)(Lecture);
