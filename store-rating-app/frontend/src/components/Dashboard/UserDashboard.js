import Navbar from "../Layout/Navbar";

export default function UserDashboard() {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body text-center">
                <h2 className="mb-3">Welcome, User!</h2>
                <p className="lead">
                  You can browse stores, submit ratings, and update your
                  profile.
                </p>
                <a href="/stores" className="btn btn-primary mt-3">
                  View Stores
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
