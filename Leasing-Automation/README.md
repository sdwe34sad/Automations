# Leasing Assistant

---
![Pipeline Architecture Blueprint](asset/Leasing-Automation.pngLeasing-Automation.png)

### Workflow Name: Leasing_Engine_v1

### 1. Phase 1: Lead Ingestion (The Gateway)

The objective is to consolidate leads from multiple platforms into a single source of truth (Freshsales CRM).

* **Trigger**: Use **Email Parser by Zapier** or **Webhooks by Zapier**.
* **Setup**:
* Forward emails from [LEAD_SOURCE_PROVIDER] to your designated Zapier Parser address.
* **Action**: Use **Formatter by Zapier** (Text) to extract `Applicant_Name`, `Applicant_Email`, `Applicant_Phone`, and `Property_Interest`.


* **CRM Action**: Create/Update a contact in **Freshsales**.
* **Field Mapping**: Map parsed variables to corresponding CRM fields.
* **Tagging**: Set `Status` to `New`.



### 2. Phase 2: AI Qualification (The Reasoning Layer)

We utilize **Zapier Central** to manage conversational intelligence without manual intervention.

* **Agent Configuration**:
* **Knowledge Base**: Upload property program guidelines and qualification criteria PDF.
* **Instruction Set**:
> "You are the MIOYM Leasing Assistant. Respond to new leads immediately. Ask for Credit Score and Annual Household Income. If credit score is < 600, inform them they do not currently qualify. If >= 600, provide a link to the scheduling calendar."




* **Integration**: Connect the Agent to **Freshsales** to read and write lead status updates.

### 3. Phase 3: Scheduling & Verification

Once the AI classifies the lead as "Qualified" (Credit $\ge$ 600), the following automated steps occur:

* **Scheduling**:
* **Action**: **Google Calendar** integration to check real-time availability and generate a booking event.
* **Action**: Update CRM `Status` to `Tour Scheduled`.


* **Document Collection**:
* **Action**: Trigger an email via **Outlook/Gmail** requesting a government-issued ID upload to a secured link (e.g., Google Drive/Typeform).


* **Credit Verification**:
* **Action**: Once a file is uploaded, trigger a **Webhook** to your Credit Verification API.
* **Payload**:
```json
{
  "applicant_email": "{{applicant_email}}",
  "doc_url": "{{uploaded_doc_url}}"
}

```





### 4. Phase 4: Access Control

* **Action**: If the verification API returns a "Success" status, trigger the **Smart Lock API**.
* **Configuration**:
* **Method**: POST
* **Endpoint**: `[SMART_LOCK_API_ENDPOINT]`
* **Body**:
```json
{
  "property_id": "{{property_id}}",
  "code": "{{generated_secure_code}}",
  "valid_from": "{{tour_start_time}}",
  "valid_until": "{{tour_end_time}}"
}

```





---

### System Summary Table

| Step | Platform | Primary Action |
| --- | --- | --- |
| **Ingestion** | Zapier Parser | Standardize lead data from all sources. |
| **Qualification** | Zapier Central | Analyze credit/income; filter qualified leads. |
| **Booking** | Google Calendar | Automate tour scheduling. |
| **Verification** | Webhooks | Run background checks and document processing. |
| **Access** | Smart Lock API | Issue temporary door codes upon approval. |

---

### Deployment Checklist

1. **Environment Variables**: Replace all `[PLACEHOLDERS]` with your specific API keys and endpoint URLs in the Zapier "Connections" manager.
2. **Testing**: Run the workflow in "Draft" mode using a dummy email address to verify the qualification logic (test both < 600 and > 600 scenarios).
3. **Monitoring**: Use **Zapier Task History** to monitor for "Failed" steps; set up email notifications for any workflow errors.

