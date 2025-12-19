import "./Other.css";

const TOS = () => {
  return (
    <div className="other-page">
      <h1>Terms of Service</h1>

      <h4>Last updated: December 19, 2025</h4>

      <h2>Binding Agreement</h2>
      <ul>
        <li>
          The Terms Of Service (the Terms) are a binding agreement between the
          user and the GoobApp developers ("we", "us", or "our").
        </li>
        <li>If you do not accept the Terms, do not use this application.</li>
      </ul>

      <h2>Service Description</h2>
      <ul>
        <li>
          GoobApp is an online chatting website/platform with one global chat.
        </li>
        <li>GoobApp is open-sourced under the MIT license.</li>
        <li>
          The code is available on GitHub:{" "}
          <a
            href="https://github.com/GoobApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/GoobApp
          </a>{" "}
          (Note: This link contains all repositories hosted on GitHub, including
          but not limited to the frontend website).
        </li>
      </ul>

      <h2>Important info</h2>
      <ul>
        <li>
          We, the GoobApp developers, are not responsible for any user-generated
          content on GoobApp.
        </li>
        <li>You must be 13 years of age or older to use GoobApp.</li>
        <li>
          Any user-generated content that breaks any laws is not our
          responsibility.
        </li>
        <li>
          We do not guarantee constant or real-time monitoring, or any
          monitoring of GoobApp at all. Anything we missed is not on us.
        </li>
        <li>
          Users are fully responsible for anything they post, send, or share
          through GoobApp.
        </li>
        <li>
          We hold the right to restrict or ban access if GoobApp is used in any
          harmful, abusive, or illegal ways.
        </li>
        <li>
          GoobApp is provided ‘as is,’ with no warranties or guarantees of any
          kind.
        </li>
        <li>
          We hold the right to modify, update, or do any other action to any
          user or message at any time, without prior warning. This includes terminating
          accounts. There does not have to be a reason provided.
        </li>
        <li>We hold the right to update the Terms at any time.</li>
      </ul>

      <h2>Contact information</h2>
      <ul>
        <li>
          To contact the GoobApp developers, email{" "}
          <a
            href="mailto:support@goobapp.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            support@goobapp.org
          </a>
          .
        </li>
      </ul>
    </div>
  );
};

export default TOS;
