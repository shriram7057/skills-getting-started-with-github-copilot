from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)


def test_get_activities():
    """
    Arrange:
        Create test client

    Act:
        Send GET request to /activities

    Assert:
        Verify response is successful
    """

    response = client.get("/activities")

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_signup_success():
    """
    Arrange:
        Prepare signup data

    Act:
        Send POST request

    Assert:
        Verify successful signup
    """

    response = client.post(
        "/activities/Chess Club/signup",
        params={"email": "teststudent@mergington.edu"}
    )

    assert response.status_code == 200
    assert "Signed up" in response.json()["message"]


def test_duplicate_signup():
    """
    Arrange:
        Existing participant email

    Act:
        Attempt duplicate signup

    Assert:
        Verify duplicate signup is rejected
    """

    email = "duplicate@mergington.edu"

    client.post(
        "/activities/Programming Class/signup",
        params={"email": email}
    )

    response = client.post(
        "/activities/Programming Class/signup",
        params={"email": email}
    )

    assert response.status_code == 400
    assert response.json()["detail"] == \
        "Student is already signed up for this activity"


def test_signup_invalid_activity():
    """
    Arrange:
        Invalid activity name

    Act:
        Send signup request

    Assert:
        Verify 404 response
    """

    response = client.post(
        "/activities/Unknown Activity/signup",
        params={"email": "student@mergington.edu"}
    )

    assert response.status_code == 404