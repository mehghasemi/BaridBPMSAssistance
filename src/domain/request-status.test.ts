import { canTransition } from './request-status'

function expect(value: boolean, message: string) {
  if (!value) throw new Error(message)
}

expect(canTransition('DRAFT', 'SUBMITTED_BY_CUSTOMER', 'CUSTOMER'), 'مشتری باید بتواند پیش‌نویس را ارسال کند.')
expect(!canTransition('DRAFT', 'UNDER_REVIEW', 'CUSTOMER'), 'مشتری نباید بتواند مستقیماً وضعیت بررسی را ثبت کند.')
expect(canTransition('UNDER_REVIEW', 'CUSTOMER_COMPLETION_REQUIRED', 'SPECIALIST'), 'کارشناس باید بتواند تکمیل مشتری را درخواست کند.')
expect(!canTransition('CLOSED', 'DRAFT', 'ADMIN'), 'درخواست بسته‌شده نباید به پیش‌نویس بازگردد.')
