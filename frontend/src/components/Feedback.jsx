export default function Feedback({ message, type }) {
  if (!message) return null;

  return (
    <div className={`form-feedback ${type === "success" ? "is-success" : "is-error"}`}>
      {message}
    </div>
  );
}