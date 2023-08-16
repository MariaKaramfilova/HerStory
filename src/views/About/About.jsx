import { ABOUT_PAGE } from "../../common/common";
import { ABOUT_PAGE_MESSAGE } from "../../common/common";
/**
 * The About page component.
 *
 * @returns {JSX.Element} - JSX representing the About page content.
 */
export default function About() {
  return (
    <div>
      <h1>{ABOUT_PAGE}</h1>
      <p>{ABOUT_PAGE_MESSAGE}</p>
    </div>
  );
}
