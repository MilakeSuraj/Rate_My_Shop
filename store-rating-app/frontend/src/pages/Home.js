import Navbar from "../components/Layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-50">
          <div className="col-md-8 text-center">
            <h1 className="display-4 mb-3">Welcome to Store Rating App</h1>
            <p className="lead mb-4">
              Rate your favorite stores and discover the best places around you!
            </p>
            <a href="/login" className="btn btn-primary btn-lg me-2">
              Login
            </a>
            <a href="/register" className="btn btn-outline-success btn-lg">
              Register
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
