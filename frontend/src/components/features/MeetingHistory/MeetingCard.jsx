import { Card, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { formatDate } from '../../../utils/helpers';

const MeetingCard = ({ meeting }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Code: {meeting.meetingCode}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Date: {formatDate(meeting.date)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
