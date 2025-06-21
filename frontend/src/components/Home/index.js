import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = props => {
  const findJobs = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <h1 className="heading">Find The Job That Fits Your Life</h1>
        <p className="description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential
        </p>
        <Link to="/jobs">
          <button className="find-jobs-button" type="button" onClick={findJobs}>
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}
export default Home
