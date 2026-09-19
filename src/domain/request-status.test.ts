import { canTransition } from './request-status'

function expect(value: boolean, message: string) {
  if (!value) throw new Error(message)
}

expect(canTransition('DRAFT', 'SUBMITTED_BY_CUSTOMER', 'CUSTOMER'), 'مشتری باید بتواند پیش‌نویس را ارسال کند.')
expect(!canTransition('DRAFT', 'UNDER_REVIEW', 'CUSTOMER'), 'مشتری نباید بتواند مستقیماً وضعیت بررسی را ثبت کند.')
expect(canTransition('UNDER_REVIEW', 'CUSTOMER_COMPLETION_REQUIRED', 'SPECIALIST'), 'کارشناس باید بتواند تکمیل مشتری را درخواست کند.')
expect(canTransition('SUBMITTED_BY_CUSTOMER', 'UNDER_REVIEW', 'SPECIALIST'), 'کارشناس باید بتواند بررسی درخواست ارسال‌شده را شروع کند.')
expect(canTransition('CUSTOMER_COMPLETION_REQUIRED', 'SUBMITTED_BY_CUSTOMER', 'CUSTOMER'), 'مشتری باید بتواند پس از تکمیل، درخواست را دوباره ارسال کند.')
expect(canTransition('UNDER_REVIEW', 'FINAL_APPROVED', 'SPECIALIST'), 'کارشناس باید بتواند درخواست را تأیید نهایی کند.')
expect(canTransition('FINAL_APPROVED', 'READY_FOR_DESIGN', 'SPECIALIST'), 'کارشناس باید بتواند درخواست تأییدشده را برای طراحی آماده کند.')
expect(canTransition('READY_FOR_DESIGN', 'CLOSED', 'SPECIALIST'), 'کارشناس باید بتواند درخواست آماده طراحی را ببندد.')
expect(canTransition('READY_FOR_DESIGN', 'CLOSED', 'ADMIN'), 'مدیر باید بتواند درخواست آماده طراحی را ببندد.')
expect(!canTransition('CLOSED', 'DRAFT', 'ADMIN'), 'درخواست بسته‌شده نباید به پیش‌نویس بازگردد.')
