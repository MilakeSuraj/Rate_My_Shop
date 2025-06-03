export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1 text-danger">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="lead">
        Sorry, the page you are looking for does not exist.
      </p>
      <a href="/" className="btn btn-primary mt-3">
        Go Home
      </a>
    </div>
  );
}
