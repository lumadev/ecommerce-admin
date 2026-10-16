---
applyTo: "src/**/*.{jsx,tsx}"
---

# Form validation

- Display validation errors directly below the field or group of controls that has the error.
- Associate each validation error with its corresponding field; do not show field validation errors only in a toast or a general form-level alert.
- Clear a field's error when the user corrects that field, and ensure submit validation rejects missing or incomplete required values.
- Keep errors accessible, using an appropriate live region such as `role="alert"` and `aria-invalid` where applicable.
- Reserve form-level messages for errors that do not belong to a specific field, such as a failed server request.
- Use a semantic `<form onSubmit>` and an explicit `type="submit"` button so Enter in single-line fields submits the form. Mark auxiliary buttons as `type="button"` to prevent accidental submissions.
- Do not suppress Enter's default form submission in ordinary single-line fields. Preserve the native newline behavior of multiline fields such as `<textarea>`.
- In token or chip fields, Enter may commit the current value instead of submitting the form; prevent the default submission in that field and document the interaction in its UI when needed.
