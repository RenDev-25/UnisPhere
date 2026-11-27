
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
      'Hello! I am your UNISphere AI Assistant. I can help you understand your OJT eligibility, applications, requirements, and deployment status.',
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
          'Yes. Under the UNISphere specification, requirements are physical documents verified by the OJT Coordinator. There is no digital document-upload feature in this frontend.'
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
          'The current UNISphere frontend does not include a daily time record or OJT-hour logging feature. Please follow the recording and attendance procedures provided by your OJT Coordinator.'
      },
      {
        label: 'How many OJT hours are required?',
        reply: 'The required OJT deployment duration is 500 HOURS. Check My Deployment for your official assignment and required-hours information.'
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
        label: 'What is the required OJT deployment duration?',
        reply: 'The system-wide required OJT deployment duration is 500 HOURS. The deployment record also stores accumulated hours when those are available.'
      },
      {
        label: 'How can I monitor pending applications?',
        reply:
          'Navigate to Applications Management to view application records, their current statuses, and available student and company details.'
      },
      {
        label: 'How do I review deployment activity?',
        reply: 'Open Deployment Management to review pending student deployment requests, confirm eligible students, and manage active deployment records.'
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

  'coordinator-browse-companies': {
    title: 'Browse Companies',
    intro:
      'I can help you browse published Host Training Establishments, review company details, and check student application counts.',
    summary: 'Published HTE Directory • Read-only Access',

    prompts: [
      {
        label: 'How can I check active partner companies?',
        reply:
          'Review the Browse Companies directory. It lists published company profiles and their corresponding statuses.'
      },
      {
        label: 'How can I see how many students applied?',
        reply:
          'Check the Students Applied column or open View Details to see the number of distinct students who submitted an application to that company.'
      },
      {
        label: 'Can I add or edit a company?',
        reply:
          'No. Coordinator access is read-only. Company registration and profile updates are handled by the registered Company Supervisor.'
      },
      {
        label: 'How do I check company slot availability?',
        reply: 'Open Company Management or Browse Companies and review each company’s registered capacity, occupied slots, and available slots. Slots are consumed only after official coordinator deployment.'
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
        label: 'Can I edit this company profile?',
        reply:
          'No. Coordinator access is read-only. Only the registered Company Supervisor can update the company profile.'
      },
      {
        label: 'Where can I review partnership compliance?',
        reply: 'Open the company record and review its Memorandum of Agreement and compliance information. Contact the registered supervisor if supporting information needs updating.'
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
        label: 'When is a student eligible?',
        reply: 'A student is eligible only when the coordinator has verified the required pre-deployment checklist and recorded the eligibility status as Eligible.'
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
        label: 'How do I review deployment requests?',
        reply: 'Open Deployment Management. Student requests appear after a supervisor accepts the application and the student accepts the company offer.'
      },
      {
        label: 'What happens after a student accepts an offer?',
        reply: 'The accepted offer becomes a deployment request for coordinator review. The student is not officially deployed until the coordinator confirms deployment.'
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

  const contexts = portal === 'student' ? studentContexts : coordinatorContexts;

  return contexts[pageKey] ?? {
    title:
      portal === 'student' ? 'Student Portal' : portal === 'supervisor' ? 'Supervisor Portal' : 'Coordinator Workspace',

    intro: portal === 'supervisor'
      ? 'Welcome to the UNISphere Supervisor Assistant. I can help with company profiles, applicant review, accepted offers, and deployed interns.'
      : 'Welcome to UNISphere AI Assistant. Select a suggested prompt to learn more about the current page.',

    summary: portal === 'coordinator' ? 'Coordinator Workspace' : portal === 'supervisor' ? 'Supervisor Workspace' : undefined,

    prompts: portal === 'supervisor' ? [
      { label: 'How do I review student applications?', reply: 'Open Applications Management to review applications submitted to your company. You can accept or reject each application and provide remarks.' },
      { label: 'What happens when I accept an applicant?', reply: 'The student receives an offer notification. The student must accept the offer before it becomes a deployment request for coordinator review.' },
      { label: 'How do I view officially deployed interns?', reply: 'Open My Interns to view students officially deployed by the OJT Coordinator. Each deployment has a required duration of 500 HOURS.' },
      { label: 'How do I update my company profile?', reply: 'Open Company Profile to update your establishment information, registered slots, accepted programs, and publication status.' }
    ] : [
      { label: 'What can I do on this page?', reply: 'This page provides access to the UNISphere information and features available for your current portal.' },
      { label: 'Where can I find more information?', reply: 'Use the navigation menu to access the appropriate UNISphere section.' }
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



  return {
    text:
      prompt.reply ||
      'I can provide general guidance about this UNISphere section. Please refer to the corresponding page for the available information.',

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
    'I can help with UNISphere requirements, eligibility, company applications, supervisor offers, notifications, 500 OJT hours, deployment requests, and undeployment. Ask about one of these features for step-by-step guidance.';

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
      portal === 'student' ? 'Visit Browse Companies to view the available Host Training Establishments and their accepted programs.' : portal === 'supervisor' ? 'Open Company Profile to create, update, and publish your company information.' : 'Review Host Training Establishment records through the available Coordinator tools.';
  } else if (normalized.includes('500') || normalized.includes('hour')) {
    response = 'The required OJT deployment duration is 500 hours. The deployment record shows the required hours; accumulated hours remain 0 until an authorized time-recording feature is available.';
  } else if (normalized.includes('undeploy')) {
    response = 'When a coordinator undeploys a student, the active assignment ends, the company slot is released, and the previous deployment remains in history. The student must submit a new application and complete the offer and coordinator deployment process again.';
  } else if (normalized.includes('notification')) {
    response = 'Open the bell icon in the top bar to view notifications. New notifications are marked unread; select one to mark it as read. Notifications are saved to the signed-in account.';
  } else if (normalized.includes('eligibility')) {
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
