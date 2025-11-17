from django.db import models
from apps.business.models import BusinessProfile
from apps.users.models import TimeStampedModel


class BusinessLoans(TimeStampedModel):

    class LoanStatus(models.TextChoices):
        PAID = 'PAID', 'paid'
        PENDING = 'PENDING', 'pending'

    class Category(models.TextChoices):  #will help give targetted advice like inventory loans are too high
        WORKING_CAPITAL = 'WORKING_CAPITAL', 'working_capital'
        INVENTORY = 'INVENTORY', 'inventory'
        EQUIPMENT = 'EQUIPMENT', 'equipment'
        EXPANSION = 'EXPANSION', 'expansion'
        OPERATIONS = 'OPERATIONS', 'operations'

    business = models.ForeignKey(
        BusinessProfile,
        on_delete=models.CASCADE,
        related_name='business_loans'
    )

    reason = models.TextField(null=True, blank=True)
    lender = models.CharField(max_length=30)

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        null=True,
        blank=True
    )

    principal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.FloatField(null=True)  # percent decimal e.g. 0.12
    loan_period = models.FloatField(null=False)  # years

    date_of_loan = models.DateField(null=True, blank=True)

    loan_status = models.CharField(
        max_length=20,
        choices=LoanStatus.choices,
        default=LoanStatus.PENDING
    )

    @property
    def total_amount(self):
        return self.principal_amount + (self.principal_amount * self.interest_rate * self.loan_period)

    @property
    def balance(self):
        total_paid = self.repayments.aggregate(
            total=models.Sum('amount_paid')
        )['total'] or 0

        return self.total_amount - total_paid


class LoanRepayment(TimeStampedModel):
    business_loan = models.ForeignKey(
        BusinessLoans,
        on_delete=models.CASCADE,
        related_name='repayments'
    )

    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    date_paid = models.DateField()
