import { PrismaClient, RequestPriority, RequestStatus, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const organization = await prisma.organization.upsert({ where: { name: 'شرکت سپهر' }, update: {}, create: { name: 'شرکت سپهر' } })
  const unit = await prisma.organizationalUnit.upsert({ where: { organizationId_name: { organizationId: organization.id, name: 'منابع انسانی' } }, update: {}, create: { name: 'منابع انسانی', organizationId: organization.id } })
  const customer = await prisma.user.upsert({ where: { email: 'maryam@sepehr.local' }, update: {}, create: { fullName: 'مریم احمدی', role: UserRole.CUSTOMER, organizationId: organization.id, email: 'maryam@sepehr.local' } })
  const specialist = await prisma.user.upsert({ where: { email: 'ali@pargar.local' }, update: {}, create: { fullName: 'علی رضایی', role: UserRole.SPECIALIST, email: 'ali@pargar.local' } })
  let leaveRequest = await prisma.formDesignRequest.findFirst({ where: { formName: 'فرم درخواست مرخصی', organizationId: organization.id } })
  if (!leaveRequest) {
    leaveRequest = await prisma.formDesignRequest.create({ data: { formName: 'فرم درخواست مرخصی', purpose: 'ثبت و بررسی انواع مرخصی کارکنان', briefProcess: 'کارمند درخواست را ثبت می‌کند، مدیر بررسی می‌کند و منابع انسانی نتیجه را اعلام می‌کند.', audiences: 'همه کارکنان و مدیران مستقیم', priority: RequestPriority.NORMAL, status: RequestStatus.CUSTOMER_COMPLETION_REQUIRED, organizationId: organization.id, ownerUnitId: unit.id, createdById: customer.id, sections: { create: { title: 'اطلاعات مرخصی', sortOrder: 1 } } } })
  }
  const existingComment = await prisma.comment.findFirst({ where: { requestId: leaveRequest.id, body: 'لطفاً مشخص کنید آیا تاریخ پایان می‌تواند قبل از تاریخ شروع باشد یا خیر.' } })
  if (!existingComment) await prisma.comment.create({ data: { body: 'لطفاً مشخص کنید آیا تاریخ پایان می‌تواند قبل از تاریخ شروع باشد یا خیر.', targetType: 'FIELD', targetId: null, requestId: leaveRequest.id, authorId: specialist.id } })
  const existingHistory = await prisma.changeHistory.count({ where: { requestId: leaveRequest.id } })
  if (existingHistory === 0) await prisma.changeHistory.createMany({ data: [
    { action: 'ایجاد پیش‌نویس', entityType: 'REQUEST', entityId: leaveRequest.id, requestId: leaveRequest.id, actorId: customer.id },
    { action: 'ارسال برای بررسی', entityType: 'STATUS', entityId: leaveRequest.id, oldValue: RequestStatus.DRAFT, newValue: RequestStatus.SUBMITTED_BY_CUSTOMER, requestId: leaveRequest.id, actorId: customer.id },
    { action: 'نیازمند تکمیل مشتری', entityType: 'STATUS', entityId: leaveRequest.id, oldValue: RequestStatus.UNDER_REVIEW, newValue: RequestStatus.CUSTOMER_COMPLETION_REQUIRED, requestId: leaveRequest.id, actorId: specialist.id },
  ] })
  console.log(`داده نمونه برای «${leaveRequest.formName}» آماده است.`)
}

main().finally(() => prisma.$disconnect())
