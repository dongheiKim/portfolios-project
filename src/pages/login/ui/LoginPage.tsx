import { Link } from "react-router";
import { SignInForm } from "@/features/auth/sign-in";
import {
  LOGIN_PAGE_COPY,
  LOGIN_PAGE_STYLES,
} from "../model/loginPage.constants";

export function LoginPage() {
  return (
    <main className={LOGIN_PAGE_STYLES.page}>
      <section className={LOGIN_PAGE_STYLES.wrapper}>
        <header className={LOGIN_PAGE_STYLES.hero}>
          <p className={LOGIN_PAGE_STYLES.badge}>{LOGIN_PAGE_COPY.badge}</p>
          <h1 className={LOGIN_PAGE_STYLES.heading}>
            {LOGIN_PAGE_COPY.titleLine1}
            <br />
            {LOGIN_PAGE_COPY.titleLine2}
          </h1>
          <p className={LOGIN_PAGE_STYLES.description}>
            {LOGIN_PAGE_COPY.description}
          </p>
        </header>

        <article
          className={LOGIN_PAGE_STYLES.panel}
          aria-labelledby="login-page-title"
        >
          <div className={LOGIN_PAGE_STYLES.panelHeader}>
            <h2 id="login-page-title" className={LOGIN_PAGE_STYLES.panelTitle}>
              {LOGIN_PAGE_COPY.formTitle}
            </h2>
            <p className={LOGIN_PAGE_STYLES.panelDescription}>
              {LOGIN_PAGE_COPY.formDescription}
            </p>
          </div>
          <SignInForm />
          <p className={LOGIN_PAGE_STYLES.switchText}>
            {LOGIN_PAGE_COPY.switchDescription}{" "}
            <Link to="/signup" className={LOGIN_PAGE_STYLES.switchLink}>
              {LOGIN_PAGE_COPY.switchAction}
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
