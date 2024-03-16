# from django.db import models, migrations

# # Define a custom SQL query to create the table
# create_custom_table_sql = """
#         CREATE TABLE test_django_pg (
#             title TEXT,
#             url TEXT,
#             content TEXT,
#             tokens INT,
#             vector_info vector(384)
#         );

# """
# # """
# #         CREATE EXTENSION IF NOT EXISTS pgvector;
# #         """,
# class MyModel(models.Model):
#     # Use the RawSQL field to execute the custom SQL query
#     custom_table = models.RawSQL(create_custom_table_sql, output_field=models.IntegerField())
