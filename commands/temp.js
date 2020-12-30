module.exports = {
  name: "temp",
  execute(Discord, request, message, userLocation, send) {
    request(
      `http://api.weatherapi.com/v1/current.json?q=${userLocation}&key=439e86839c264d0ca5d70022202712`,
      { json: true },
      (err, res, body) => {
        if (err) {
          return console.log(err);
        }

        var current = body.current;

        var tempIcon = `https:${current.condition.icon}`;
        console.log(current);

        var embed = new Discord.MessageEmbed()
          .setTitle("Today")
          .setColor("#9b34eb")
          .setThumbnail(tempIcon)
          .setDescription(`${current.condition.text}`)
          .addFields(
            {
              name: "Condition:",
              value: current.condition.text,
            },
            {
              name: "Temperature (Celsius)",
              value: `${current.temp_c}\u00B0C`,
              inline: true,
            },
            {
              name: "Temperature (Fahrenheit)",
              value: `${current.temp_f}\u00B0F`,
              inline: true,
            },
            {
              name: "Feels Like ",
              value: `${current.feelslike_c}\u00B0C or ${current.feelslike_f}\u00B0F`,
              inline: true,
            },
            {
              name: "Precipitation: ",
              value: `${current.precip_mm}mm`,
              inline: true,
            },
            {
              name: "Wind Speed:",
              value: `${current.wind_kph} km/h`,
              inline: true,
            },
            {
              name: "Wind Direction: ",
              value: current.wind_dir,
              inline: true,
            },
            {
              name: "Humidity: ",
              value: `${current.humidity}%`,
              inline: true,
            },
            {
              name: "Visibility: ",
              value: `${current.vis_km}km`,
              inline: true,
            },
            {
              name: "UV Index: ",
              value: current.uv,
              inline: true,
            }
          );

        send(embed);

        if (current.uv >= 7) {
          send(
            `------------------------------------------------------------------------------\n\n**!! WARNING !!**\n\nThe UV Index is above 7, which is considered extreme.\nIf you live in "${userLocation}", please **don't** leave your house without applying sunscreen.\n------------------------------------------------------------------------------`
          );
        }

        if (current.precip_mm >= 2.54) {
          send(
            `------------------------------------------------------------------------------\n\n**!! WARNING !!**\n\nThe precipitation is ${current.precip_mm}mm.\nI suggest taking an umbrella or a rain coat when going out\n------------------------------------------------------------------------------`
          );
        }
      }
    );
  },
};
