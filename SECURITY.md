# Security Policy

## Supported Versions

We actively monitor and patch vulnerabilities in `@studioframes/condense`. Please ensure you are running the latest stable release to receive security updates.

| Version | Status | Supported | Notes |
| --- | --- | --- | --- |
| **0.3.4** | **Active** | :white_check_mark: |  |
| **0.3.3** | **Unmaintained** | :white_check_mark: | No security vulnerabilities at present, but no new ones will be fixed. |
| **0.3.2** | **Unmaintained** | :white_check_mark: | No security vulnerabilities at present, but no new ones will be fixed. |
| **0.3.1** | **Deprecated** | :x: | Unsupported due to the version containing security vulnerabilities that have been patched in [v0.3.2](https://github.com/studioframes/Condense/releases/tag/v0.3.2) |
| **0.3.0** | **Deprecated** | :x: | Unsupported due to the version containing security vulnerabilities that have been patched in [v0.3.2](https://github.com/studioframes/Condense/releases/tag/v0.3.2) |
| **0.2.x** | **Unmaintained** | :white_check_mark: | No security vulnerabilities at present, but no new ones will be fixed. |
| **0.1.x** | **Deprecated** | :x: | End of life |

## Our Security Guarantees

To ensure the safety of the JavaScript ecosystem, `@studioframes/condense` implements the following security posture:

* **Immutable Releases:** All release tags (`v*`) are protected by repository rulesets preventing force-pushes, deletion, or history overwrites.
* **Build Provenance:** Package publication to the npm registry is handled strictly via OpenID Connect (OIDC) through GitHub Actions, generating a verifiable cryptographic chain of custody.
* **Process Sandboxing:** Media operations via `ffmpeg` are executed inside isolated background processes wrapped with short execution timeouts to mitigate Denial of Service (DoS) attacks via corrupted files.

## Supply Chain Security

We take proactive measures to harden our software supply chain against upstream malicious injection, typosquatting, and compromised dependencies:

* **Automated Vulnerability Scanning:** Every pull request and daily branch snapshot is audited using GitHub Dependabot, Socket and `npm audit` to flag and remediate known CVEs instantly.
* **Strict Lockfile Enforcement:** We enforce cryptographically signed lockfiles (`package-lock.json`) in CI/CD pipelines to guarantee that production builds identically match tested code, eliminating dynamic runtime dependency drift.
* **Minimal Dependency Footprint:** We heavily vet and restrict third-party modules, preferring native Node.js APIs wherever possible to reduce the surface area available for upstream security exploitation.

## Reporting a Vulnerability

**Please do not open public GitHub issues for security vulnerabilities.** If you discover a security flaw, backdoor, or dependency risk within this package, please report it responsibly:

1.  **Submit a Draft Security Advisory:** Go to the **Security** tab of this repository on GitHub, select **Advisories**, and click **New draft advisory**.
2.  **Provide Details:** Include a detailed description of the vulnerability, steps or a proof-of-concept (PoC) script to reproduce the issue, and the potential impact.
3.  **Timeline:** We will acknowledge your report within 48 hours and work on a security patch. Once resolved, a new patch version will be published to npm, and a public advisory will be released to credit your disclosure.

Thank you for helping keep our open-source tools safe!
