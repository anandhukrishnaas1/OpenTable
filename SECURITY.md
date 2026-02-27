# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of OpenTable seriously. If you believe you have found a security vulnerability, please report it responsibly.

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Email us at **opentable.team@gmail.com** with:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (optional)

### What to Expect

- **Acknowledgment**: We will acknowledge your report within **48 hours**
- **Assessment**: We will investigate and provide an initial assessment within **5 business days**
- **Resolution**: We aim to resolve critical vulnerabilities within **14 days**
- **Disclosure**: We will coordinate with you on public disclosure timing

### Security Best Practices

This project implements the following security measures:

- **Authentication**: Firebase Auth with Google OAuth 2.0 and Email/Password
- **Authorization**: Role-based access control (Donor, Volunteer, Admin)
- **Database Security**: Firestore security rules requiring authentication
- **API Key Protection**: All sensitive keys stored in environment variables (`.env`)
- **Identity Verification**: Volunteer identity verification with photo ID and selfie
- **Image Security**: Cloudinary unsigned upload presets (no API secret exposed client-side)
- **HTTPS**: All communications encrypted via TLS/SSL

### Scope

The following are in scope for security reports:

- Authentication and authorization bypasses
- Cross-site scripting (XSS) vulnerabilities
- Cross-site request forgery (CSRF) issues
- Data exposure or leakage
- Firebase security rule bypasses
- API key exposure

## Acknowledgments

We appreciate the security research community's efforts in helping keep OpenTable and its users safe.
