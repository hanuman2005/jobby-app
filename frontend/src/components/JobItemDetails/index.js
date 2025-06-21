import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    status: 'INITIAL',
    jobDetails: null,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({status: apiStatus.loading})
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {headers: {Authorization: `Bearer ${jwtToken}`}}

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          title: data.job_details.title,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          skills: data.job_details.skills.map(skill => ({
            imageUrl: skill.image_url,
            name: skill.name,
          })),
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
        },
        similarJobs: data.similar_jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          rating: job.rating,
          title: job.title,
        })),
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  onRetry = () => {
    this.getJobDetails()
  }

  openCompanySite = () => {
    const {jobDetails} = this.state
    window.open(jobDetails.company_website_url, '_blank')
  }

  renderJobDetails() {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      rating,
      jobDescription,
      title,
      location,
      packagePerAnnum,
      skills,
      lifeAtCompany,
    } = jobDetails
    return (
      <div className="job-details-card">
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div className="job-title-rating">
            <h1 className="job-item-title">{title}</h1>
            <div className="job-item-rating-section">
              <FaStar className="rating-icon" />
              <p className="job-item-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-meta">
          <div className="job-item-meta-details">
            <div className="job-meta-item">
              <MdLocationOn />
              <p className="job-item-location">{location}</p>
            </div>
            <div className="job-meta-item">
              <BsFillBriefcaseFill />
              <p className="job-item-type">{employmentType}</p>
            </div>
          </div>
          <p className="job-item-package">{packagePerAnnum}</p>
        </div>
        <hr className="horizontal-line" />
        <div className="description-container">
          <h1 className="job-description-label">Description</h1>
          <a href={companyWebsiteUrl} target="_blank" rel="noopener noreferrer">
            <button type="button" className="visit-button">
              Visit <FiExternalLink />
            </button>
          </a>
        </div>
        <p className="job-description">{jobDescription}</p>
        <div className="skills-container">
          <h1 className="skills-section-title">Skills</h1>
          <ul className="skill-items">
            {skills.map(skill => (
              <li className="skill-item" key={skill.name}>
                <img
                  className="skill-image"
                  src={skill.imageUrl}
                  alt={skill.name}
                />
                <p className="skill">{skill.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="life-at-companey-section">
          <div className="life_at_company-detais">
            <h1>Life at Company</h1>
            <p>{lifeAtCompany.description}</p>
          </div>
          <img src={lifeAtCompany.imageUrl} alt="life at company" />
        </div>
      </div>
    )
  }

  renderSimilarJobs() {
    const {similarJobs} = this.state
    return (
      <div className="similar-jobs">
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-items">
          {similarJobs.map(job => (
            <li className="similar-jobs-job-card" key={job.id}>
              <div className="job-header">
                <img
                  src={job.companyLogoUrl}
                  alt=" similar job company logo"
                  className="company-logo"
                />
                <div className="job-title-rating">
                  <h1 className="job-title">{job.title}</h1>
                  <div className="job-rating-section">
                    <FaStar className="rating-icon" />
                    <p className="job-rating">{job.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="job-description-label">Description</h1>
              <p className="job-description">{job.jobDescription}</p>
              <div className="job-meta">
                <div className="job-meta-details">
                  <div className="job-meta-item">
                    <MdLocationOn />
                    <p className="job-location">{job.location}</p>
                  </div>
                  <div className="job-meta-item">
                    <BsFillBriefcaseFill />
                    <p className="job-type">{job.employmentType}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderContent() {
    const {status} = this.state
    switch (status) {
      case apiStatus.loading:
        return this.renderLoadingView()
      case apiStatus.success:
        return (
          <>
            {this.renderJobDetails()}
            {this.renderSimilarJobs()}
          </>
        )
      case apiStatus.failure:
        return (
          <div className="jobs-failure">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button type="button" onClick={this.onRetry}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">{this.renderContent()}</div>
      </>
    )
  }
}

export default JobItemDetails
