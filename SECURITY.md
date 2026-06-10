# Security Policy

## Supported Versions

We actively monitor and patch vulnerabilities in `@studioframes/condense`. Please ensure you are running the latest stable release to receive security updates.

| Version | Supported          |
| ------- | ------------------ |
| >=0.1.1 | :white_check_mark: |
| <0.1.1  | :x:                |

## Our Security Guarantees

To ensure the safety of the JavaScript ecosystem, `@studioframes/condense` implements the following security posture:

* **Immutable Releases:** All release tags (`v*`) are protected by repository rulesets preventing force-pushes, deletion, or history overwrites.
* **Build Provenance:** Package publication to the npm registry is handled strictly via OpenID Connect (OIDC) through GitHub Actions, generating a verifiable cryptographic chain of custody.
* **Process Sandboxing:** Media operations via `ffmpeg` are executed inside isolated background processes wrapped with short execution timeouts to mitigate Denial of Service (DoS) attacks via corrupted files.

## Reporting a Vulnerability

**Please do not open public GitHub issues for security vulnerabilities.** If you discover a security flaw, backdoor, or dependency risk within this package, please report it responsibly:

1.  **Submit a Draft Security Advisory:** Go to the **Security** tab of this repository on GitHub, select **Advisories**, and click **New draft advisory**.
2.  **Provide Details:** Include a detailed description of the vulnerability, steps or a proof-of-concept (PoC) script to reproduce the issue, and the potential impact.
3.  **Timeline:** We will acknowledge your report within 48 hours and work on a security patch. Once resolved, a new patch version will be published to npm, and a public advisory will be released to credit your disclosure.

Thank you for helping keep our open-source tools safe!
