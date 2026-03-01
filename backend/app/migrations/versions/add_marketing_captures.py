"""Add marketing_captures table

Revision ID: add_marketing_captures
Revises:
Create Date: 2026-02-28

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "add_marketing_captures"
down_revision = None  # Update this to your latest migration
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "marketing_captures",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.Text(), nullable=False),
        sa.Column("source", sa.Text(), nullable=False),
        sa.Column("discount_code", sa.Text(), nullable=True),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("last_captured_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("capture_count", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("converted", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("converted_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema="public",
    )
    op.create_index("ix_marketing_captures_email", "marketing_captures", ["email"], unique=False, schema="public")
    op.create_index("ix_marketing_captures_source", "marketing_captures", ["source"], unique=False, schema="public")


def downgrade() -> None:
    op.drop_index("ix_marketing_captures_source", table_name="marketing_captures", schema="public")
    op.drop_index("ix_marketing_captures_email", table_name="marketing_captures", schema="public")
    op.drop_table("marketing_captures", schema="public")
