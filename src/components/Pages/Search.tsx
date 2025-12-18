import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import "../../App.css";
import "./Other.css";

const Search = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [iframeSrc, setiframeSrc] = useState("");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    searchInputRef.current?.focus();

    const searchParam = searchParams.get("q");
    if (searchParam) {
      if (searchInputRef.current) {
        searchInputRef.current.value = searchParam.replace(
          "https://www.google.com/search?q=",
          ""
        );
      }
      setiframeSrc(searchParam);
    } else {
      searchInputRef.current?.select();
    }
  }, [location]);

  const submitForm = (event: FormEvent) => {
    event.preventDefault();

    let value = searchInputRef.current?.value;
    if (!value) return;

    if (
      value.includes("https://") ||
      value.includes("www.") ||
      value.includes(".com") ||
      value.includes(".org")
    ) {
      if (!value.includes("https://")) {
        value = "https://" + value;
      }
    } else {
      value = "https://www.google.com/search?q=" + value.replaceAll(" ", "+");
    }

    setiframeSrc("");
    setSearchParams({ q: value });
  };

  return (
    <div className="search-page">
      <form onSubmit={submitForm}>
        <input
          placeholder="Search Gooble or type a URL"
          className="search"
          id="searchInput"
          ref={searchInputRef}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
        ></input>
      </form>
      {iframeSrc != "" && (
        <iframe className="search-view" src={iframeSrc}></iframe>
      )}
      {iframeSrc != "" && (
        <p>
          Not able to view?{" "}
          <Link to={iframeSrc} target="_blank" viewTransition={true}>
            Click here
          </Link>{" "}
          for the website to open in a new tab!{" "}
          <Link to="/extras/search/learnmore" viewTransition={true}>
            Learn why this happens.
          </Link>
        </p>
      )}
    </div>
  );
};

export default Search;
