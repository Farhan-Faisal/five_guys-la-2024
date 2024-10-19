import textstat

class DepthRanker:
    def __init__(self):
        pass

    def rank_dale_chall_readability(self, input):
        return textstat.dale_chall_readability_score(input)