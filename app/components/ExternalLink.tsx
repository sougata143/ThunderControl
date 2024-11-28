import { Link } from 'expo-router';
import { type ComponentProps } from 'react';
import { Platform, Linking } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

const ExternalLink = ({ href, ...rest }: Props) => {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          await Linking.openURL(href);
        }
      }}
    />
  );
};

export default ExternalLink;
