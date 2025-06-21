import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsApiStatus: apiStatusConstants.initial,
    profileApiStatus: apiStatusConstants.initial,
    jobsList: [],
    profile: {},
    employmentTypes: [],
    minimumPackage: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {headers: {Authorization: `Bearer ${jwtToken}`}}
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profile: profileDetails,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {searchInput, employmentTypes, minimumPackage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentTypesQuery = employmentTypes.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesQuery}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        location: job.location,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
      }))
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const showJobs = jobsList.length > 0
    return showJobs ? (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <JobCard key={job.id} jobDetails={job} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs found illustration"
          className="no-jobs-img"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-desc">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="job-failure-heading">Oops! Something Went Wrong</h1>
      <p className="job-failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getJobs} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onSearchChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchClick = () => {
    this.getJobs()
  }

  onEmploymentTypeChange = id => {
    this.setState(prevState => {
      const updatedTypes = prevState.employmentTypes.includes(id)
        ? prevState.employmentTypes.filter(each => each !== id)
        : [...prevState.employmentTypes, id]
      return {employmentTypes: updatedTypes}
    }, this.getJobs)
  }

  onSalaryChange = id => {
    this.setState({minimumPackage: id}, this.getJobs)
  }

  renderProfile = () => {
    const {profileApiStatus, profile} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return (
          <div className="profile-card">
            <img
              src={profile.profileImageUrl}
              alt="profile"
              className="profile-image"
            />
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-bio">{profile.shortBio}</p>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div className="profile-failure">
            <button
              type="button"
              onClick={this.getProfileDetails}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="mobile-search-container">
            <input
              type="search"
              value={searchInput}
              onChange={this.onSearchChange}
              placeholder="Search"
              className="search-input"
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.onSearchClick}
              className="search-icon-button"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="jobs-filter-section">
            {this.renderProfile()}
            <hr />
            <div className="employement-types-section">
              <h1 className="filter-title">Type of Employment</h1>
              <ul className="filters-list">
                {employmentTypesList.map(type => (
                  <li key={type.employmentTypeId} className="filter-item">
                    <input
                      type="checkbox"
                      id={type.employmentTypeId}
                      onChange={() =>
                        this.onEmploymentTypeChange(type.employmentTypeId)
                      }
                    />
                    <label htmlFor={type.employmentTypeId}>{type.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div>
              <h1 className="filter-title">Salary Range</h1>
              <ul className="filters-list">
                {salaryRangesList.map(range => (
                  <li key={range.salaryRangeId}>
                    <input
                      type="radio"
                      id={range.salaryRangeId}
                      name="salary"
                      onChange={() => this.onSalaryChange(range.salaryRangeId)}
                    />
                    <label htmlFor={range.salaryRangeId}>{range.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-list-section">
            <div className="desktop-search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.onSearchChange}
                placeholder="Search"
                className="search-input"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onSearchClick}
                className="search-icon-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
