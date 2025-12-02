from django.db import models
from apps.business.models import BusinessProfile
from apps.users.models import TimeStampedModel
from django.core.exceptions import ValidationError
from decimal import Decimal

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

    #caclulates total amount based on simple interest method
    @property
    def total_amount(self):
        if self.interest_rate:
           return self.principal_amount + (self.principal_amount * Decimal(self.interest_rate) * Decimal(self.loan_period))

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
    
    

    def clean(self):
        """
        Model-level validation to ensure repayment never exceeds loan balance.
        Runs when full_clean() is called.
        """
        super().clean()

        if self.amount_paid is None or self.business_loan is None:
            return  # nothing to validate

        # Get dynamic balance directly from the loan object
        remaining_balance = self.business_loan.balance

        # If this is an update, exclude the current record from the total
        if self.pk:
            remaining_balance += self.amount_paid  # add back old amount

        if self.amount_paid > remaining_balance:
            raise ValidationError(
                {"amount_paid": "Repayment exceeds the remaining loan balance."}
            )

    def save(self, *args, **kwargs):
        """
        Protects the model by enforcing validation BEFORE saving.
        Any save() from API, admin, script, or shell must pass validation.
        """
        self.full_clean()   # ← runs clean() and all field validations
        return super().save(*args, **kwargs)

