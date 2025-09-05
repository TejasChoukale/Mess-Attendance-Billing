
# Pull Request Template

## Title
<!-- Example: feat: add meal form component -->

## Description
- Briefly explain the purpose of this PR.  
- Example:  
  - Adds `MealForm` component to let user mark today's meal (WHOLE_DAY / AFTERNOON / NIGHT).  
  - Validates single submission per day using doc id = `${userId}_${date}`.  
  - Updates README with usage instructions.

## Type of Change
- [ ] 🚀 Feature
- [ ] 🐞 Bug Fix
- [ ] 📖 Documentation
- [ ] 🔧 Refactor / Chore
- [ ] Other (please describe):

## Testing Instructions
1. Login as a test user.  
2. Select a radio option and submit.  
3. Verify new doc in Firestore with id format: `userid_YYYY-MM-DD`.

## Screenshots (if applicable)
<!-- Add screenshots/gifs to help reviewers understand the change -->

## Checklist
- [ ] Code follows project guidelines and naming conventions  
- [ ] Tested locally and works as expected  
- [ ] Documentation/README updated if needed  
- [ ] Linked related issues  

## Related Issues
Closes: #<issue_number>
