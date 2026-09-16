export type RequestStatus =
  | 'DRAFT'
  | 'SUBMITTED_BY_CUSTOMER'
  | 'UNDER_REVIEW'
  | 'CUSTOMER_COMPLETION_REQUIRED'
  | 'FINAL_APPROVED'
  | 'READY_FOR_DESIGN'
  | 'CLOSED'

export type UserRole = 'CUSTOMER' | 'SPECIALIST' | 'ADMIN'

export const statusMeta: Record<RequestStatus, { label: string; tone: 'neutral' | 'info' | 'warning' | 'success'; description: string }> = {
  DRAFT: { label: 'پیش‌نویس', tone: 'neutral', description: 'مشتری در حال تکمیل درخواست است.' },
  SUBMITTED_BY_CUSTOMER: { label: 'ارسال‌شده توسط مشتری', tone: 'info', description: 'درخواست منتظر شروع بررسی کارشناس است.' },
  UNDER_REVIEW: { label: 'در حال بررسی', tone: 'info', description: 'کارشناس در حال بررسی نیازمندی‌ها است.' },
  CUSTOMER_COMPLETION_REQUIRED: { label: 'نیازمند تکمیل مشتری', tone: 'warning', description: 'مشتری باید به پرسش‌ها پاسخ دهد یا بخش مشخص‌شده را اصلاح کند.' },
  FINAL_APPROVED: { label: 'تأیید نهایی', tone: 'success', description: 'نیازمندی توسط مشتری تأیید نهایی شده است.' },
  READY_FOR_DESIGN: { label: 'آماده طراحی', tone: 'success', description: 'درخواست آماده تحویل به تیم طراحی است.' },
  CLOSED: { label: 'بسته‌شده', tone: 'neutral', description: 'کار طراحی و تحویل درخواست خاتمه یافته است.' },
}

const transitions: Record<RequestStatus, Partial<Record<UserRole, RequestStatus[]>>> = {
  DRAFT: { CUSTOMER: ['SUBMITTED_BY_CUSTOMER'] },
  SUBMITTED_BY_CUSTOMER: { SPECIALIST: ['UNDER_REVIEW'] },
  UNDER_REVIEW: { SPECIALIST: ['CUSTOMER_COMPLETION_REQUIRED', 'FINAL_APPROVED'] },
  CUSTOMER_COMPLETION_REQUIRED: { CUSTOMER: ['SUBMITTED_BY_CUSTOMER'] },
  FINAL_APPROVED: { SPECIALIST: ['READY_FOR_DESIGN'] },
  READY_FOR_DESIGN: { SPECIALIST: ['CLOSED'], ADMIN: ['CLOSED'] },
  CLOSED: {},
}

export function allowedTransitions(status: RequestStatus, role: UserRole): RequestStatus[] {
  return transitions[status][role] ?? []
}

export function canTransition(status: RequestStatus, nextStatus: RequestStatus, role: UserRole): boolean {
  return allowedTransitions(status, role).includes(nextStatus)
}
