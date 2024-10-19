import textstat

class DepthRanker:
    def __init__(self):
        """
        Initializes the DepthRanker class.
        """
        pass

    def rank_dale_chall_readability(self, input: str) -> float:
        """
        Ranks the readability of the given text using the Dale-Chall readability formula.

        Args:
            input (str): The text to be ranked.

        Returns:
            float: The Dale-Chall readability score of the input text.
        """
        return textstat.dale_chall_readability_score(input)