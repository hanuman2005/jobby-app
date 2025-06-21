import {withRouter} from 'react-router-dom'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {history} = props
  return (
    <li
      key={jobDetails.id}
      className="job-card"
      onClick={() => history.push(`/jobs/${jobDetails.id}`)}
    >
      <div className="job-header">
        <img
          src={jobDetails.companyLogoUrl}
          alt="company logo"
          className="company-logo"
        />
        <div className="job-title-rating">
          <h1 className="job-title">{jobDetails.title}</h1>
          <div className="job-rating-section">
            <FaStar className="rating-icon" />
            <p className="job-rating">{jobDetails.rating}</p>
          </div>
        </div>
      </div>
      <div className="job-meta">
        <div className="job-meta-details">
          <div className="job-meta-item">
            <MdLocationOn />
            <p className="job-location">{jobDetails.location}</p>
          </div>
          <div className="job-meta-item">
            <BsFillBriefcaseFill />
            <p className="job-type">{jobDetails.employmentType}</p>
          </div>
        </div>
        <p className="job-package">{jobDetails.packagePerAnnum}</p>
      </div>
      <hr className="horizontal-line" />
      <h1 className="job-description-label">Description</h1>
      <p className="job-description">{jobDetails.jobDescription}</p>
    </li>
  )
}

export default withRouter(JobCard)
