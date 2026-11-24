
/* src/ts/mocks/chatbot.mock.ts */

import type { Portal } from '../types/user.types';
import type {
  AssistantContext,
  AssistantPrompt,
  ChatbotReply
} from '../types/chat.types';

/* ========================================
   STUDENT ASSISTANT CONTEXTS
======================================== */

const studentContexts: Record<string, AssistantContext> = {

  'student-dashboard': {
    title: 'Student Dashboard',
    intro:
      'Hello! I am your OJTFlow AI Assistant. I can help you understand your OJT eligibility, applications, requirements, and deployment status.',
    launcherSubtitle: 'Instant OJT Assistance',

    prompts: [
      {
        label: 'How can I check my OJT eligibility?',
        reply:
          'You can check your eligibility through the My Eligibility section of your student dashboard. Your eligibility status is based on the requirements and qualifications verified by your OJT Coordinator.'
      },
      {
        label: 'How many applications have I submitted?',
        reply:
          'You can view your submitted applications in the My Applications page. The page displays your applications, their current statuses, and available details.'
      },
      {
        label: 'Which requirements are incomplete?',
        reply:
          'Open OJT Requirements to see your requirement checklist. Requirements that are not yet approved or submitted will be indicated by their corresponding status.'
      },
      {
        label: 'What does my application status mean?',
        reply:
          'Your application status indicates the current progress of your application. Refer to My Applications to view the status assigned to each company application.'
      },
      {
        label: 'What is my current deployment status?',
        reply:
          'Your deployment information is available under My Deployment. Placement and deployment information is displayed when it has been provided by your OJT Coordinator.'
      }
    ]
  },

  'student-browse-companies': {
    title: 'Batangas HTE Directory',
    intro:
      'Welcome to the Host Training Establishment directory. I can help you understand company listings and the information displayed on each company card.',
    launcherSubtitle: 'Company Directory Help',

    prompts: [
      {
        label: 'Which companies are accepting applicants?',
        reply:
          'Check the Availability information on each company card. Companies marked as accepting applicants have available opportunities. You can also use the availability filter to narrow your results.'
      },
      {
        label: 'Which programs does a company accept?',
        reply:
          'Open the company details to view its accepted programs. Make sure your academic program is included before submitting an application.'
      },
      {
        label: 'How can I find companies near me?',
        reply:
          'Use the location or municipality filter on the Browse Companies page to narrow the directory according to the available company locations.'
      },
      {
        label: 'Where can I find company contact information?',
        reply:
          'Select View Details on a company card. The company details view provides the available establishment information and contact details.'
      }
    ]
  },

  'student-applications': {
    title: 'My Applications',
    intro:
      'I can help you understand your company applications, their statuses, and what to expect while waiting for a response.',
    launcherSubtitle: 'Application Assistance',

    prompts: [
      {
        label: 'What does Pending Decision mean?',
        reply:
          'Pending Decision means that your application has not yet received a final decision. Check the application details for any available remarks or updates from the coordinator.'
      },
      {
        label: 'How long should I wait for a response?',
        reply:
          'The roadmap does not define a fixed application response period. You can monitor the status of your application through My Applications and contact your OJT Coordinator if you need clarification.'
      },
      {
        label: 'Can I apply to more companies?',
        reply:
          'You can browse the available Host Training Establishments through Browse Companies. Check each company’s availability and accepted programs before applying.'
      }
    ]
  },

  'student-requirements': {
    title: 'OJT Requirements',
    intro:
      'I can help you understand your pre-deployment requirements and the physical documents that need to be prepared and verified.',
    launcherSubtitle: 'Instant Requirement Help',

    prompts: [
      {
        label: 'When does my medical certificate expire?',
        reply:
          'Check the medical certificate details and its recorded validity information. If the expiry date is missing or unclear, ask your OJT Coordinator to verify it.'
      },
      {
        label: 'What should I know about my endorsement letter?',
        reply:
          'The endorsement letter is one of the pre-deployment requirements. Check its status in your requirements checklist and coordinate with your OJT Coordinator regarding its preparation and verification.'
      },
      {
        label: 'Do I need to submit physical hardcopies?',
        reply:
          'Yes. Under the OJTFlow specification, requirements are physical documents verified by the OJT Coordinator. There is no digital document-upload feature in this frontend.'
      }
    ]
  },

  'student-deployment': {
    title: 'My Deployment',
    intro:
      'Welcome to your deployment assistance panel. I can help you understand your placement information and prepare for your first day.',
    launcherSubtitle: 'Instant Requirement Help',

    prompts: [
      {
        label: 'When is my OJT start date?',
        reply:
          'Check the deployment information displayed on your My Deployment page. Your assigned start date should come from the deployment information provided by your OJT Coordinator.'
      },
      {
        label: 'How do I log my OJT hours?',
        reply:
          'The current OJTFlow frontend does not include a daily time record or OJT-hour logging feature. Please follow the recording and attendance procedures provided by your OJT Coordinator.'
      },
      {
        label: 'How should I prepare for Day 1?',
        reply:
          'Before your first day, review your deployment details, confirm your reporting schedule, prepare the required physical documents, and make sure you know the location of your assigned establishment.'
      },
      {
        label: 'How can I contact my supervisor?',
        reply:
          'Check the available supervisor or company contact information in your deployment details. If the contact information is not displayed, coordinate with your OJT Coordinator.'
      }
    ]
  }

};

/* ========================================
   COORDINATOR ASSISTANT CONTEXTS
======================================== */

const coordinatorContexts: Record<string, AssistantContext> = {

  'coordinator-dashboard': {
    title: 'Coordinator Dashboard',
    intro:
      'Welcome to your OJT Coordinator Assistant. I can help explain dashboard indicators and guide you through student monitoring.',
    summary:
      'Coordinator Workspace • Student Monitoring • OJT Overview',

    prompts: [
      {
        label: 'Explain the dashboard KPI indicators.',
        reply:
          'The dashboard KPIs provide an overview of student records, eligibility, applications, placements, and deployment progress. Refer to the corresponding management pages for individual records.'
      },
      {
        label: 'How can I review students awaiting verification?',
        reply:
          'Open Eligibility & Requirements to review student eligibility records and their requirement statuses.'
      },
      {
        label: 'How can I monitor pending applications?',
        reply:
          'Navigate to Applications Management to view application records, their current statuses, and available student and company details.'
      },
      {
        label: 'Export the current dashboard report.',
        reply: '',
        displayOnly: true
      }
    ]
  },

  'coordinator-student-management': {
    title: 'Student Management',
    intro:
      'I can help you navigate student records and understand the student management information.',
    summary: 'Student Directory • Student Records',

    prompts: [
      {
        label: 'How can I locate a student record?',
        reply:
          'Use the available search and filtering controls in Student Management to locate a student. Select the corresponding record to view its details.'
      },
      {
        label: 'Where can I check student eligibility?',
        reply:
          'Open Eligibility & Requirements to review a student’s eligibility and requirement verification statuses.'
      },
      {
        label: 'Show students with incomplete requirements.',
        reply:
          'Use the Eligibility & Requirements page to review requirement statuses and identify records that need further verification.'
      }
    ]
  },

  'coordinator-student-details': {
    title: 'Student Details',
    intro:
      'I can guide you through reviewing a student record and its related OJT information.',
    summary: 'Student Record • Academic Information',

    prompts: [
      {
        label: 'What student information should I verify?',
        reply:
          'Review the student identification details, academic program, and the available eligibility and OJT information displayed on the record.'
      },
      {
        label: 'How do I review missing requirements?',
        reply:
          'Open the Eligibility & Requirements section to check the student’s requirement checklist and identify items that need verification.'
      }
    ]
  },

  'coordinator-company-management': {
    title: 'Company Management',
    intro:
      'I can help you understand Host Training Establishment records, company availability, and company management.',
    summary: 'HTE Directory • Company Records',

    prompts: [
      {
        label: 'How can I check active partner companies?',
        reply:
          'Review the Company Management summary and table. The page displays company records and their corresponding statuses.'
      },
      {
        label: 'How can I add a new partner company?',
        reply:
          'Select Add Company and complete the company information, program information, and other required form sections.'
      },
      {
        label: 'How can I update company information?',
        reply:
          'Select Edit on the corresponding company record to open the Edit Company page.'
      },
      {
        label: 'Generate a company partnership report.',
        reply: '',
        displayOnly: true
      }
    ]
  },

  'coordinator-company-details': {
    title: 'Company Details',
    intro:
      'I can help explain the information displayed in a Host Training Establishment record.',
    summary: 'HTE Profile • Partnership Information',

    prompts: [
      {
        label: 'What is the Partner ID?',
        reply:
          'The Partner ID is the identifier assigned to a Host Training Establishment record. It is displayed as company record information.'
      },
      {
        label: 'What does MoA Compliant mean?',
        reply:
          'MoA Compliant refers to the Memorandum of Agreement compliance status displayed in the company record.'
      },
      {
        label: 'How can I update this company record?',
        reply:
          'Use the available Edit Company option to access the editable company information.'
      },
      {
        label: 'Check the MoA clauses.',
        reply: '',
        displayOnly: true
      }
    ]
  },

  'coordinator-company-add': {
    title: 'Add Company',
    intro:
      'I can guide you through the information required when adding a new Host Training Establishment.',
    summary: 'New HTE Record • Company Information',

    prompts: [
      {
        label: 'What information is required when adding a company?',
        reply:
          'Complete the required company information, contact details, program information, and available slots in the Add Company form.'
      },
      {
        label: 'How do I assign accepted academic programs?',
        reply:
          'Use the program selection section of the form to select the academic programs accepted by the Host Training Establishment.'
      },
      {
        label: 'Why is the company logo required?',
        reply:
          'The company form includes a logo area for the establishment profile. The logo preview can be used to check the selected image before saving.'
      },
      {
        label: 'Draft a partnership confirmation email.',
        reply: '',
        displayOnly: true
      },
      {
        label: 'Generate a partner onboarding packet.',
        reply: '',
        displayOnly: true
      }
    ]
  },

  'coordinator-company-edit': {
    title: 'Edit Company',
    intro:
      'I can help you review the editable company information and accepted academic programs.',
    summary: 'HTE Record • Company Information',

    prompts: [
      {
        label: 'Which company information can I update?',
        reply:
          'Review the editable fields in the Edit Company form, including the company information, contact details, accepted programs, and available slots.'
      },
      {
        label: 'How can I update accepted programs?',
        reply:
          'Use the program selection cards in the Edit Company form to update the programs accepted by the establishment.'
      },
      {
        label: 'Can I change the Partner ID?',
        reply:
          'The Partner ID is displayed as record information and is not an editable field in the company form.'
      }
    ]
  },

  'coordinator-eligibility-requirements': {
    title: 'Eligibility & Requirements',
    intro:
      'I can help you understand student eligibility records and requirement verification.',
    summary: 'Eligibility Monitoring • Requirement Verification',

    prompts: [
      {
        label: 'How do I verify student requirements?',
        reply:
          'Open the corresponding student eligibility details and review the listed requirements. Update statuses using the available verification controls.'
      },
      {
        label: 'What does For Review mean?',
        reply:
          'For Review indicates that the eligibility record or requirement needs further checking by the OJT Coordinator.'
      },
      {
        label: 'How can I identify incomplete requirements?',
        reply:
          'Review the requirement counts and status indicators in Eligibility & Requirements to identify records that still need verification.'
      },
      {
        label: 'Generate eligibility verification packets.',
        reply: '',
        displayOnly: true
      }
    ]
  },

  'coordinator-applications-management': {
    title: 'Applications Management',
    intro:
      'I can help you understand application statuses and navigate application review.',
    summary: 'Application Monitoring • Review',

    prompts: [
      {
        label: 'How do I review a student application?',
        reply:
          'Select the application record to open its details. Review the available student information, company information, and application details.'
      },
      {
        label: 'What does Pending Decision mean?',
        reply:
          'Pending Decision means that the application has not yet received a final decision.'
      },
      {
        label: 'How do I update an application status?',
        reply:
          'Open the corresponding Application Details page and use the available status update form.'
      },
      {
        label: 'Export the application records.',
        reply: '',
        displayOnly: true
      },
      {
        label: 'Draft an application decision email.',
        reply: '',
        displayOnly: true
      }
    ]
  }

};

/* ========================================
   CONTEXT RESOLVER
======================================== */

export function getAssistantContext(
  portal: Portal,
  pageKey: string
): AssistantContext {

  const contexts =
    portal === 'student'
      ? studentContexts
      : coordinatorContexts;

  return contexts[pageKey] ?? {
    title:
      portal === 'student'
        ? 'Student Portal'
        : 'Coordinator Workspace',

    intro:
      'Welcome to OJTFlow AI Assistant. Select a suggested prompt to learn more about the current page.',

    summary:
      portal === 'coordinator'
        ? 'Coordinator Workspace'
        : undefined,

    prompts: [
      {
        label: 'What can I do on this page?',
        reply:
          'This page provides access to the OJTFlow information and features available for your current portal.'
      },
      {
        label: 'Where can I find more information?',
        reply:
          'Use the navigation menu to access the appropriate OJTFlow section.'
      }
    ]
  };
}

/* ========================================
   SCRIPTED MOCK REPLIES
======================================== */

export async function getChatbotReply(
  prompt: AssistantPrompt,
  _portal: Portal
): Promise<ChatbotReply> {

  // Simulate a short assistant response delay.
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 650);
  });

  if (prompt.displayOnly) {
    return {
      text:
        'This action is not available yet. It is displayed as a demonstration prompt only and will require future backend functionality.',

      isDemo: true
    };
  }

  return {
    text:
      prompt.reply ||
      'I can provide general guidance about this OJTFlow section. Please refer to the corresponding page for the available information.',

    isDemo: true
  };
}

/* ========================================
   FREE-TEXT FALLBACK
======================================== */

export async function getFreeTextReply(
  message: string,
  portal: Portal
): Promise<ChatbotReply> {

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 650);
  });

  const normalized = message.toLowerCase();

  let response =
    'Thank you for your question. This is a demonstration response. Please select one of the suggested prompts for more specific OJTFlow guidance.';

  if (
    normalized.includes('requirement') ||
    normalized.includes('document')
  ) {
    response =
      'You can review requirement information in the OJT Requirements section. For verification concerns, please coordinate with your OJT Coordinator.';
  } else if (
    normalized.includes('application')
  ) {
    response =
      'Application information and current statuses are available in the My Applications section.';
  } else if (
    normalized.includes('company') ||
    normalized.includes('partner')
  ) {
    response =
      portal === 'student'
        ? 'Visit Browse Companies to view the available Host Training Establishments and their accepted programs.'
        : 'Visit Company Management to review Host Training Establishment records.';
  } else if (
    normalized.includes('eligibility')
  ) {
    response =
      portal === 'student'
        ? 'You can review your eligibility information through your student dashboard and OJT requirements.'
        : 'Open Eligibility & Requirements to review student eligibility records and verification statuses.';
  }

  return {
    text: response,
    isDemo: true
  };
}
