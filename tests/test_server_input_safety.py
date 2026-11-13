import unittest
from pathlib import Path


class ServerInputSafetyTests(unittest.TestCase):
    def test_request_values_are_not_interpolated_into_python_source(self):
        source = (Path(__file__).resolve().parents[1] / "server" / "index.ts").read_text(
            encoding="utf-8"
        )

        for forbidden in (
            'DB.get_mission("\${missionId}")',
            'DB.get_results("\${id}")',
            "spec = \${spec}",
            'if "\${format}" == "csv"',
        ):
            self.assertNotIn(forbidden, source)

        for required in (
            "BELENTANI_MISSION_ID",
            "BELENTANI_MISSION_SPEC",
            "BELENTANI_EXPORT_FORMAT",
            "DB.get_tasks(mission_id)",
        ):
            self.assertIn(required, source)


if __name__ == "__main__":
    unittest.main()
