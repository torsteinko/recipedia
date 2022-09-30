from app.schema import AppMutations, AppQueries
import graphene


class Queries(AppQueries):
    pass


class Mutations(AppMutations):
    pass


schema = graphene.Schema(query=Queries, mutation=AppMutations)
